import { DISHES, DISH_BY_ID, isDishAllowed } from './data.js';
import { evaluateBalance } from './nutrition.js';

const byRole = Object.groupBy ? Object.groupBy(DISHES, d => d.role) : DISHES.reduce((m, d) => ((m[d.role] ||= []).push(d), m), {});

export const DEFAULT_SETTINGS = Object.freeze({
  mealType: 'family', specialType: 'random', peopleCount: 4,
  maxCookingTime: null, minCookingTime: null, mealSize: 'auto',
  excludedIngredients: [], vegetarian: false
});

export function normalizeSettings(input = {}) {
  const mealType = ['family', 'special', 'nhau', 'quick'].includes(input.mealType) ? input.mealType : 'family';
  const specialType = ['random', 'feast', 'hotpot', 'barbecue', 'delicacy'].includes(input.specialType) ? input.specialType : 'random';
  const mealSize = ['auto', 'compact', 'normal', 'hearty'].includes(input.mealSize) ? input.mealSize : 'auto';
  const peopleCount = Number.isFinite(+input.peopleCount) ? Math.max(1, Math.min(20, Math.round(+input.peopleCount))) : 4;
  const maxCookingTime = [30, 60].includes(+input.maxCookingTime) ? +input.maxCookingTime : null;
  const minCookingTime = [30, 61].includes(input.minCookingTime) ? input.minCookingTime : null;
  return {
    mealType, specialType, peopleCount, maxCookingTime, minCookingTime, mealSize,
    excludedIngredients: Array.isArray(input.excludedIngredients) ? input.excludedIngredients.filter(x => typeof x === 'string') : [],
    vegetarian: Boolean(input.vegetarian)
  };
}

function slot(role, index = 0) { return { slotId: `${role}-${index}`, role }; }

function getSlots(options, explicitStyle = null) {
  const size = options.mealSize === 'auto' ? (options.peopleCount >= 7 ? 'hearty' : options.peopleCount === 1 ? 'compact' : 'normal') : options.mealSize;
  const list = [];
  const push = (role, n = 1) => { for (let i = 0; i < n; i++) list.push(slot(role, list.filter(s => s.role === role).length)); };
  let style = explicitStyle || options.mealType;
  if (options.mealType === 'special') {
    style = explicitStyle || (options.specialType !== 'random' ? options.specialType : ['feast', 'hotpot', 'barbecue', 'delicacy'][Math.floor(Math.random() * 4)]);
  }
  switch (style) {
    case 'family':
      push('staple'); push('main'); if (size !== 'compact') push('secondary');
      push('vegetable'); push('soup'); if (size === 'hearty') push('side');
      break;
    case 'quick':
      push('staple'); push('main'); push('vegetable'); push('soup');
      break;
    case 'hotpot':
      push('hotpot'); push('dippingVeg', size === 'hearty' ? 3 : 2);
      push('dippingProtein', size === 'compact' ? 0 : size === 'hearty' ? 2 : 1);
      push('staple'); if (size === 'hearty') push('appetizer');
      break;
    case 'barbecue':
      push('barbecue', size === 'compact' ? 1 : size === 'hearty' ? 3 : 2);
      push('vegetable'); push('staple'); if (size !== 'compact') push('appetizer');
      break;
    case 'feast':
    case 'delicacy':
      push('staple'); push('main', size === 'compact' ? 1 : 2);
      if (size !== 'compact') push('secondary'); push('vegetable'); push('soup');
      if (size === 'hearty') push('side');
      break;
    case 'nhau':
      push('appetizer', size === 'hearty' ? 2 : 1);
      push('main', size === 'compact' ? 1 : size === 'hearty' ? 3 : 2);
      push('vegetable'); if (size !== 'compact') push('side');
      break;
    default: throw new Error('Kiểu thực đơn không hợp lệ.');
  }
  return { slots: list, style };
}

function eligiblePool(role, options, style) {
  let candidates = byRole[role] || [];
  if (role === 'main' && options.vegetarian) candidates = [...candidates, ...(byRole.secondary || []).filter(d => d.vegetarian)];
  const requestedMode = options.mealType;
  return candidates.filter(d => {
    if (!isDishAllowed(d, options)) return false;
    // Lẩu ăn với bún, miến, mì, bánh đa/bánh phở; không ghép xôi hoặc cơm nếp.
    if (style === 'hotpot' && role === 'staple' && !/bún|miến|mì|bánh đa|bánh phở/i.test(d.name)) return false;
    if (requestedMode === 'quick') return d.mealTypes.includes('quick');
    if (requestedMode === 'nhau') return d.mealTypes.includes('nhau');
    if (requestedMode === 'family') return d.mealTypes.includes('family');
    if (style === 'hotpot' && ['dippingVeg', 'dippingProtein', 'hotpot'].includes(role)) return true;
    if (style === 'barbecue' && role === 'barbecue') return true;
    // Một món thường ngày vẫn có thể xuất hiện trong mâm cơm thịnh soạn.
    return d.mealTypes.includes('special');
  });
}

function weightedPick(candidates, chosen, recentCounts) {
  const weights = candidates.map(d => {
    let score = d.weight;
    const sharedIngredients = chosen.filter(i => i.dish.subCategory === d.subCategory).length;
    const sharedMethods = chosen.filter(i => i.dish.cookingMethod === d.cookingMethod).length;
    score *= Math.pow(.44, sharedIngredients) * Math.pow(.65, sharedMethods);
    score /= 1 + (recentCounts.get(d.id) || 0) * 1.4;
    return Math.max(score, .05);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let needle = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) if ((needle -= weights[i]) <= 0) return candidates[i];
  return candidates[candidates.length - 1];
}

/** Thời gian ước tính: nấu song song có giới hạn; không phải thời gian đo thực tế. */
export function estimateMealTime(items) {
  if (!items.length) return 0;
  return estimateTimes(items.map(i => i.dish.estimatedTime));
}

function estimateTimes(rawTimes) {
  if (!rawTimes.length) return 0;
  const times = [...rawTimes].sort((a, b) => b - a);
  // Chuẩn bị các món khác có thể chồng lấp một phần với công đoạn dài nhất.
  return Math.ceil(times[0] + times.slice(1).reduce((a, b) => a + b, 0) * .2);
}

function scoreCandidate(items, recentSignatures = []) {
  const balance = evaluateBalance(items);
  const subTypes = items.map(i => i.dish.subCategory);
  const methods = items.map(i => i.dish.cookingMethod);
  const uniqueSub = new Set(subTypes).size;
  const uniqueMethods = new Set(methods).size;
  const varietyScore = Math.round(100 * (uniqueSub / Math.max(items.length, 1)));
  const compatibilityScore = Math.round(100 * (uniqueMethods / Math.max(items.length, 1)));
  const signature = mealSignature(items);
  const repetitionScore = recentSignatures.includes(signature) ? 5 : 100;
  const nutritionScore = balance.score;
  const totalScore = Math.round(nutritionScore * .32 + varietyScore * .28 + compatibilityScore * .23 + repetitionScore * .17);
  return { nutritionScore, varietyScore, compatibilityScore, repetitionScore, totalScore };
}

export function mealSignature(items) {
  return items.map(i => i.dish.id).sort().join('|');
}

function validateFixed(slots, fixedItems, options, style) {
  const ids = new Set();
  const slotIds = new Set(slots.map(s => s.slotId));
  for (const item of fixedItems) {
    if (!slotIds.has(item.slotId) || ids.has(item.dish.id)) return 'Món giữ nguyên bị trùng hoặc không còn khớp cấu trúc bữa ăn.';
    if (!isDishAllowed(item.dish, options)) return `“${item.dish.name}” xung đột với thực phẩm đã loại trừ hoặc chế độ ăn.`;
    if (!eligiblePool(item.role, options, style).some(d => d.id === item.dish.id)) return `“${item.dish.name}” không phù hợp với chế độ bữa ăn mới.`;
    ids.add(item.dish.id);
  }
  return null;
}

function recentInfo(history) {
  const counts = new Map();
  const signatures = [];
  for (const meal of history.slice(0, 20)) {
    if (!meal?.items) continue;
    signatures.push(mealSignature(meal.items));
    for (const item of meal.items) counts.set(item.dish.id, (counts.get(item.dish.id) || 0) + 1);
  }
  return { counts, signatures };
}

/**
 * Trả về { ok:true, meal } hoặc {ok:false, code, message}.
 * fixedItems là các món không được thay. slots cho phép giữ nguyên bố cục khi random lại.
 */
export function generateMeal(rawOptions = {}, config = {}) {
  const options = normalizeSettings(rawOptions);
  if (options.mealType === 'quick' && options.minCookingTime) {
    return fail('CONFLICT', 'Bữa ăn nhanh không phù hợp với yêu cầu thời gian trên 60 phút.');
  }
  const template = config.slots ? { slots: config.slots, style: config.style || options.mealType } : getSlots(options);
  const { slots, style } = template;
  const fixedItems = (config.fixedItems || []).map(i => ({ ...i, locked: Boolean(i.locked) }));
  const conflict = validateFixed(slots, fixedItems, options, style);
  if (conflict) return fail('CONFLICT', conflict);
  if (fixedItems.length === slots.length) return fail('ALL_FIXED', 'Không còn món nào để thay. Hãy mở khóa ít nhất một món.');
  const pools = new Map();
  for (const s of slots) {
    if (!pools.has(s.role)) pools.set(s.role, eligiblePool(s.role, options, style));
    if (!pools.get(s.role).length) return fail('EMPTY_POOL', `Không có món phù hợp cho nhóm ${s.role}. Hãy điều chỉnh bộ lọc.`);
  }
  const recent = recentInfo(config.previousMeals || []);
  const avoidIds = new Set(config.avoidIds || []);
  const required = slots.filter(s => !fixedItems.some(i => i.slotId === s.slotId));
  const timeLimit = options.mealType === 'quick' ? Math.min(options.maxCookingTime || 30, 30) : options.maxCookingTime;
  let results = [];
  // Vòng đầu cố tránh món vừa bị thay; vòng hai nới điều kiện chống lặp nếu cần.
  for (const strictAvoid of [true, false]) {
    for (let attempt = 0; attempt < 90; attempt++) {
      const items = [...fixedItems];
      let possible = true;
      for (const [position, s] of required.entries()) {
        const used = new Set(items.map(i => i.dish.id));
        const remainingMinimumTimes = required.slice(position + 1).map(rest => Math.min(...pools.get(rest.role).map(d => d.estimatedTime)));
        const candidates = pools.get(s.role).filter(d => {
          if (used.has(d.id) || (strictAvoid && avoidIds.has(d.id))) return false;
          if (style === 'hotpot' && s.role === 'dippingProtein') {
            const hotpot = items.find(i => i.role === 'hotpot')?.dish;
            if (hotpot) {
              const animal = ['pork', 'beef', 'chicken', 'duck', 'fish', 'seafood'];
              const potGroups = hotpot.ingredientGroups.filter(g => animal.includes(g));
              const ingredientAnimal = d.ingredientGroups.filter(g => animal.includes(g));
              // Đồ chay / nấm / đậu luôn phù hợp; đạm động vật phải hợp nhóm nước lẩu.
              if (ingredientAnimal.length && (!potGroups.length || !ingredientAnimal.some(g => potGroups.includes(g)))) return false;
            }
          }
          if (!timeLimit) return true;
          const bestCaseTimes = [...items.map(i => i.dish.estimatedTime), d.estimatedTime, ...remainingMinimumTimes];
          return estimateTimes(bestCaseTimes) <= timeLimit;
        });
        if (!candidates.length) { possible = false; break; }
        const dish = weightedPick(candidates, items, recent.counts);
        items.push({ slotId: s.slotId, role: s.role, dish, locked: false });
      }
      if (!possible) continue;
      const minutes = estimateMealTime(items);
      if (timeLimit && minutes > timeLimit) continue;
      if (options.minCookingTime && minutes < options.minCookingTime) continue;
      const ordered = slots.map(s => items.find(i => i.slotId === s.slotId));
      results.push({ items: ordered, minutes, score: scoreCandidate(ordered, recent.signatures) });
    }
    if (results.length) break;
  }
  if (!results.length) return fail('NO_MATCH', 'Không thể ghép thực đơn hợp lệ với các tùy chọn hiện tại. Thử nới thời gian, giảm số món hoặc bớt thực phẩm loại trừ.');
  results.sort((a, b) => b.score.totalScore - a.score.totalScore);
  const best = results[0].score.totalScore;
  const strong = results.filter(r => r.score.totalScore >= best - 12);
  const pick = strong[Math.floor(Math.random() * strong.length)];
  return {
    ok: true,
    meal: {
      id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      style, settings: options, items: pick.items,
      estimatedMinutes: pick.minutes,
      balance: evaluateBalance(pick.items),
      score: pick.score
    }
  };
}

function fail(code, message) { return { ok: false, code, message }; }

export function regenerateUnlocked(currentMeal, options = currentMeal.settings, history = []) {
  if (!currentMeal?.items?.length) return fail('NO_MEAL', 'Chưa có thực đơn.');
  const fixedItems = currentMeal.items.filter(i => i.locked);
  if (fixedItems.length === currentMeal.items.length) return fail('ALL_LOCKED', 'Tất cả món đã khóa. Hãy mở khóa một món trước khi random.');
  return generateMeal(options, {
    slots: currentMeal.items.map(i => ({ slotId: i.slotId, role: i.role })),
    style: currentMeal.style,
    fixedItems,
    avoidIds: currentMeal.items.filter(i => !i.locked).map(i => i.dish.id),
    previousMeals: history
  });
}

export function replaceDish(currentMeal, dishId, options = currentMeal.settings, history = []) {
  const selected = currentMeal?.items?.find(i => i.dish.id === dishId);
  if (!selected) return fail('NOT_FOUND', 'Không tìm thấy món cần đổi.');
  if (selected.locked) return fail('LOCKED', 'Hãy mở khóa món này trước khi đổi.');
  const fixedItems = currentMeal.items.filter(i => i.slotId !== selected.slotId);
  return generateMeal(options, {
    slots: currentMeal.items.map(i => ({ slotId: i.slotId, role: i.role })),
    style: currentMeal.style, fixedItems,
    avoidIds: [dishId], previousMeals: history
  });
}

export function toggleDishLock(meal, dishId) {
  if (!meal) return null;
  return { ...meal, items: meal.items.map(i => i.dish.id === dishId ? { ...i, locked: !i.locked } : i) };
}

export function unlockAllDishes(meal) {
  if (!meal) return null;
  return { ...meal, items: meal.items.map(i => ({ ...i, locked: false })) };
}

export function reviveMeal(raw) {
  if (!raw || !Array.isArray(raw.items) || !raw.items.length || raw.items.length > 20) return null;
  const items = raw.items.map(i => {
    const dish = DISH_BY_ID.get(i?.dishId || i?.dish?.id);
    return dish && typeof i.slotId === 'string' && typeof i.role === 'string' ?
      { slotId: i.slotId, role: i.role, dish, locked: Boolean(i.locked) } : null;
  });
  if (items.some(i => !i) || new Set(items.map(i => i.dish.id)).size !== items.length) return null;
  return {
    id: typeof raw.id === 'string' ? raw.id : `restored-${Date.now()}`,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    style: typeof raw.style === 'string' ? raw.style : 'family',
    settings: normalizeSettings(raw.settings), items,
    estimatedMinutes: estimateMealTime(items), balance: evaluateBalance(items),
    score: scoreCandidate(items)
  };
}
