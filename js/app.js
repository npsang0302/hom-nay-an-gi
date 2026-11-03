import { DISHES, DATA_STATS, EXCLUSION_OPTIONS, MEAL_MODES, ROLE_LABELS } from './data.js';
import {
  DEFAULT_SETTINGS, generateMeal, regenerateUnlocked, replaceDish,
  toggleDishLock, unlockAllDishes, mealSignature, normalizeSettings
} from './generator.js';
import { loadState, saveState } from './storage.js';

const $ = selector => document.querySelector(selector);
const state = loadState();
const dom = {
  modes: $('#meal-modes'), specialWrap: $('#special-wrap'), specialType: $('#special-type'),
  people: $('#people-count'), mealSize: $('#meal-size'), cookingTime: $('#cooking-time'),
  exclusions: $('#excluded-foods'), excludeCount: $('#excluded-count'), vegetarian: $('#vegetarian-check'),
  dishList: $('#dish-list'), alert: $('#result-alert'), empty: $('#result-empty'),
  summary: $('#result-summary'), actions: $('#result-actions'), tools: $('#result-tools'),
  nutrition: $('#nutrition-card'), subtitle: $('#result-subtitle'), heading: $('#result-heading'),
  status: $('#result-status'), dialog: $('#app-dialog'), dialogContent: $('#dialog-content'),
  dialogHeading: $('#dialog-heading'), dialogKicker: $('#dialog-kicker'), toast: $('#toast')
};
let toastTimer;

function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function button(text, className, action, attrs = {}) {
  const b = el('button', className, text);
  b.type = 'button';
  if (action) b.dataset.action = action;
  Object.entries(attrs).forEach(([key, val]) => b.setAttribute(key, val));
  return b;
}

function toast(message) {
  clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add('show');
  toastTimer = setTimeout(() => dom.toast.classList.remove('show'), 2900);
}

function notifyError(message) {
  dom.alert.textContent = message;
  dom.alert.classList.remove('hidden');
  dom.alert.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  toast('Chưa tạo được thực đơn phù hợp');
}

function clearError() { dom.alert.textContent = ''; dom.alert.classList.add('hidden'); }

function applyTheme() {
  let theme = state.theme;
  if (theme === 'system') theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  $('#theme-button').textContent = theme === 'dark' ? '☀' : '☾';
  $('#theme-button').setAttribute('aria-label', theme === 'dark' ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối');
}

function renderControls() {
  const s = state.settings;
  dom.modes.querySelectorAll('[data-mode]').forEach(b => {
    const active = b.dataset.mode === s.mealType;
    b.classList.toggle('selected', active);
    b.setAttribute('aria-pressed', String(active));
  });
  dom.specialWrap.classList.toggle('hidden', s.mealType !== 'special');
  dom.specialType.value = s.specialType;
  dom.people.value = s.peopleCount;
  dom.mealSize.value = s.mealSize;
  dom.cookingTime.value = s.minCookingTime ? 'over60' : s.maxCookingTime ? String(s.maxCookingTime) : 'any';
  dom.vegetarian.checked = s.vegetarian;
  dom.exclusions.replaceChildren();
  EXCLUSION_OPTIONS.forEach(([id, label]) => {
    const item = el('label', 'exclude-chip');
    const input = el('input'); input.type = 'checkbox'; input.value = id;
    input.checked = s.excludedIngredients.includes(id);
    item.append(input, el('span', null, label));
    dom.exclusions.append(item);
  });
  dom.excludeCount.textContent = `${s.excludedIngredients.length + (s.vegetarian ? 1 : 0)} đã chọn`;
}

function readControls() {
  const time = dom.cookingTime.value;
  state.settings = normalizeSettings({
    ...state.settings,
    specialType: dom.specialType.value,
    peopleCount: dom.people.value,
    mealSize: dom.mealSize.value,
    maxCookingTime: ['30', '60'].includes(time) ? Number(time) : null,
    minCookingTime: time === 'over60' ? 61 : time === '60' ? 30 : null,
    vegetarian: dom.vegetarian.checked,
    excludedIngredients: [...dom.exclusions.querySelectorAll('input:checked')].map(x => x.value)
  });
  dom.people.value = state.settings.peopleCount;
  dom.excludeCount.textContent = `${state.settings.excludedIngredients.length + (state.settings.vegetarian ? 1 : 0)} đã chọn`;
  saveState(state);
}

function styleLabel(meal) {
  const labels = { family: 'Cơm nhà miền Bắc', quick: 'Cơm gọn mà ngon', nhau: 'Mâm ngon tụ họp',
    feast: 'Mâm cơm cải thiện', delicacy: 'Mâm đặc sản', hotpot: 'Quây quần bên lẩu', barbecue: 'Bữa nướng thơm lừng' };
  return labels[meal.style] || MEAL_MODES[meal.settings.mealType]?.label || 'Thực đơn hôm nay';
}

function renderMeal() {
  const meal = state.currentMeal;
  dom.dishList.replaceChildren();
  const available = Boolean(meal);
  [dom.summary, dom.actions, dom.tools, dom.nutrition].forEach(e => e.classList.toggle('hidden', !available));
  dom.empty.classList.toggle('hidden', available);
  if (!meal) return;
  const locked = meal.items.filter(i => i.locked).length;
  dom.heading.replaceChildren(document.createTextNode('Mâm cơm '), el('em', null, 'hôm nay'));
  dom.subtitle.textContent = styleLabel(meal);
  dom.status.lastChild.textContent = ` ${locked ? `${locked} MÓN ĐÃ KHÓA` : 'ĐÃ SẴN SÀNG'}`;

  dom.summary.replaceChildren();
  [
    `🍽️ ${meal.items.length} món`,
    `👥 ${meal.settings.peopleCount} người`,
    `◷ Khoảng ${meal.estimatedMinutes} phút`,
    `♧ ${locked} món khóa`
  ].forEach(str => dom.summary.append(el('span', 'summary-pill', str)));

  meal.items.forEach((item, i) => {
    const card = el('article', `dish-card${item.locked ? ' is-locked' : ''}`);
    card.style.animationDelay = `${Math.min(i, 7) * 32}ms`;
    card.append(el('div', 'dish-emoji', item.dish.emoji));
    const content = el('div', 'dish-text');
    content.append(el('div', 'dish-role', ROLE_LABELS[item.role] || 'Món ăn'));
    content.append(el('strong', 'dish-title', item.dish.name));
    content.append(el('div', 'dish-meta', `◷ ${item.dish.estimatedTime} phút tham khảo · ${item.dish.cookingMethod}`));
    const actions = el('div', 'dish-buttons');
    const detail = button('ⓘ', 'icon-action', 'detail', { 'aria-label': `Xem ${item.dish.name}`, title: 'Chi tiết món' });
    const replace = button('↻', 'icon-action', 'replace', { 'aria-label': `Đổi món ${item.dish.name}`, title: 'Đổi món này' });
    replace.disabled = item.locked;
    const lock = button(item.locked ? '🔒' : '🔓', `icon-action${item.locked ? ' locked' : ''}`, 'lock', {
      'aria-label': `${item.locked ? 'Mở khóa' : 'Khóa'} ${item.dish.name}`, 'aria-pressed': String(item.locked),
      title: item.locked ? 'Mở khóa món' : 'Giữ nguyên món'
    });
    [detail, replace, lock].forEach(b => { b.dataset.dishId = item.dish.id; actions.append(b); });
    card.append(content, actions);
    dom.dishList.append(card);
  });

  dom.nutrition.replaceChildren();
  const head = el('div', 'nutrition-head');
  head.append(el('strong', null, '🌿 Cân đối nhóm thực phẩm'), el('span', 'balance-badge', meal.balance.label));
  const checks = el('div', 'nutrition-checks');
  meal.balance.checks.forEach(c => checks.append(el('span', `nutrition-check${c.ok ? ' ok' : ''}`, `${c.ok ? '✓' : '○'} ${c.label}`)));
  dom.nutrition.append(head, checks);
  if (meal.balance.hints.length) {
    const list = el('ul', 'nutrition-hints');
    meal.balance.hints.forEach(h => list.append(el('li', null, h)));
    dom.nutrition.append(list);
  }
  dom.nutrition.append(el('p', 'nutrition-disclaimer', meal.balance.disclaimer));
  const saved = state.favorites.some(m => mealSignature(m.items) === mealSignature(meal.items));
  const saveButton = dom.tools.querySelector('[data-action="save"]');
  saveButton.querySelector('span').textContent = saved ? 'Đã yêu thích' : 'Lưu thực đơn';
}

function acceptResult(result, message) {
  if (!result.ok) { notifyError(result.message); return false; }
  clearError();
  state.currentMeal = result.meal;
  state.history = [result.meal, ...state.history.filter(m => m.id !== result.meal.id)].slice(0, 30);
  saveState(state);
  renderMeal();
  if (message) toast(message);
  return true;
}

function generateFresh(force = false) {
  readControls();
  const locked = state.currentMeal?.items.filter(i => i.locked) || [];
  if (locked.length && !force) {
    const sameMode = state.currentMeal.settings.mealType === state.settings.mealType &&
      (state.settings.mealType !== 'special' || state.currentMeal.style === state.settings.specialType || state.settings.specialType === 'random');
    if (!sameMode) {
      notifyError('Chế độ mới khác với thực đơn đang khóa. Hãy mở khóa tất cả hoặc chọn “Random tất cả” và xác nhận.');
      return;
    }
    acceptResult(regenerateUnlocked(state.currentMeal, state.settings, state.history), 'Đã giữ món khóa và chọn lại những món khác.');
  } else {
    acceptResult(generateMeal(state.settings, { previousMeals: state.history }), 'Mâm cơm mới đã sẵn sàng!');
  }
}

function regenerate() {
  if (!state.currentMeal) return generateFresh();
  readControls();
  acceptResult(regenerateUnlocked(state.currentMeal, state.settings, state.history), 'Đã thay những món chưa khóa.');
}

function replaceOne(dishId) {
  if (!state.currentMeal) return;
  readControls();
  const result = replaceDish(state.currentMeal, dishId, state.settings, state.history);
  acceptResult(result, 'Đã đổi riêng món này.');
}

function copyText(text, successMessage = 'Đã copy vào bộ nhớ tạm.') {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => toast(successMessage)).catch(() => legacyCopy(text, successMessage));
  }
  return Promise.resolve(legacyCopy(text, successMessage));
}

function legacyCopy(text, successMessage) {
  const area = el('textarea');
  area.value = text; area.style.position = 'fixed'; area.style.opacity = '0';
  document.body.append(area); area.select();
  let success = false;
  try { success = document.execCommand('copy'); } catch { /* fallback failed */ }
  area.remove(); toast(success ? successMessage : 'Trình duyệt không cho phép copy tự động.');
}

function mealText(meal) {
  return [`🍲 ${styleLabel(meal)} (${meal.settings.peopleCount} người)`,
    `Khoảng ${meal.estimatedMinutes} phút`, ...meal.items.map(i => `• ${ROLE_LABELS[i.role]}: ${i.dish.name}`),
    '', 'Gợi ý từ Hôm Nay Ăn Gì?'].join('\n');
}

function saveFavorite() {
  const current = state.currentMeal;
  if (!current) return;
  const signature = mealSignature(current.items);
  if (state.favorites.some(m => mealSignature(m.items) === signature)) return toast('Thực đơn này đã nằm trong yêu thích.');
  state.favorites = [current, ...state.favorites].slice(0, 100);
  saveState(state); renderMeal(); toast('Đã lưu thực đơn vào yêu thích ♡');
}

async function shareMeal() {
  if (!state.currentMeal) return;
  const text = mealText(state.currentMeal);
  if (navigator.share) {
    try { await navigator.share({ title: 'Hôm Nay Ăn Gì?', text, url: window.location.href }); return; }
    catch (error) { if (error?.name === 'AbortError') return; }
  }
  copyText(text);
}

function openDialog(title, kicker = 'THƯ VIỆN CỦA BẠN') {
  dom.dialogHeading.textContent = title;
  dom.dialogKicker.textContent = kicker;
  dom.dialogContent.replaceChildren();
  if (!dom.dialog.open) dom.dialog.showModal();
}

function openSaved(type) {
  const favorites = type === 'favorites';
  const list = favorites ? state.favorites : state.history;
  openDialog(favorites ? 'Thực đơn yêu thích' : 'Bữa ăn gần đây', favorites ? 'ĐÃ LƯU LẠI' : 'NHÌN LẠI NHỮNG MÂM CƠM');
  const container = el('div', 'dialog-list');
  if (!list.length) container.append(el('p', 'dialog-empty', favorites ? 'Chưa có thực đơn yêu thích nào.' : 'Chưa có lịch sử thực đơn.'));
  list.forEach(meal => {
    const row = el('div', 'dialog-row');
    const main = el('div', 'dialog-row-main');
    main.append(el('strong', null, styleLabel(meal)), el('small', null,
      `${meal.items.length} món · ${new Date(meal.createdAt).toLocaleDateString('vi-VN')} · ${meal.items.slice(0, 2).map(i => i.dish.name).join(', ')}...`));
    const restore = button('Xem lại', 'mini-button', 'restore', { 'data-meal-id': meal.id, 'data-list': type });
    row.append(main, restore);
    if (favorites) row.append(button('Xóa', 'mini-button danger', 'remove-favorite', { 'data-meal-id': meal.id }));
    container.append(row);
  });
  dom.dialogContent.append(container);
}

const CATEGORY_LABELS = {
  'pork-beef': 'Thịt lợn / bò', poultry: 'Gia cầm', 'fish-seafood': 'Cá / hải sản',
  'egg-tofu': 'Trứng / đậu', vegetables: 'Rau củ', soups: 'Món canh',
  hotpot: 'Lẩu', barbecue: 'Nướng', appetizer: 'Khai vị', staples: 'Tinh bột',
  sides: 'Ăn kèm', 'dipping-vegetables': 'Rau / nấm nhúng', 'dipping-proteins': 'Đồ nhúng'
};

function showExplore() {
  openDialog(`Khám phá ${DISHES.length} vị ngon`, 'MÓN BẮC VÀ MÓN QUEN CƠM NHÀ');
  const search = el('input', 'dialog-search');
  search.type = 'search'; search.placeholder = 'Tìm tên món hoặc nguyên liệu...';
  search.setAttribute('aria-label', 'Tìm kiếm món ăn');
  const category = el('select', 'dialog-filter'); category.setAttribute('aria-label', 'Lọc theo nhóm món');
  const all = el('option', null, `Tất cả nhóm (${DISHES.length})`); all.value = 'all'; category.append(all);
  Object.entries(DATA_STATS).forEach(([key, count]) => {
    const op = el('option', null, `${CATEGORY_LABELS[key] || key} (${count})`);
    op.value = key; category.append(op);
  });
  const list = el('div', 'dialog-list');
  const note = el('p', 'dialog-help');
  function filter() {
    const query = search.value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const matches = DISHES.filter(d => (category.value === 'all' || d.category === category.value) &&
      `${d.name} ${d.ingredients.join(' ')}`.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query));
    note.textContent = `Tìm thấy ${matches.length} món / thành phần`;
    list.replaceChildren();
    matches.slice(0, 120).forEach(d => {
      const row = el('div', 'dialog-row');
      row.append(el('span', null, d.emoji));
      const main = el('div', 'dialog-row-main');
      main.append(el('strong', null, d.name), el('small', null, `${CATEGORY_LABELS[d.category]} · ${d.estimatedTime} phút`));
      row.append(main, button('Chi tiết', 'mini-button', 'detail', { 'data-dish-id': d.id }));
      list.append(row);
    });
    if (matches.length > 120) list.append(el('p', 'dialog-help', 'Đang hiển thị 120 kết quả đầu. Hãy nhập tên món để thu hẹp danh sách.'));
    if (!matches.length) list.append(el('p', 'dialog-empty', 'Không tìm thấy món phù hợp.'));
  }
  search.addEventListener('input', filter); category.addEventListener('change', filter);
  dom.dialogContent.append(search, category, note, list); filter();
  search.focus();
}

function showDishDetail(dishId) {
  const dish = DISHES.find(d => d.id === dishId);
  if (!dish) return;
  openDialog(dish.name, 'CHI TIẾT MÓN ĂN');
  const info = el('p', 'dialog-help', `${dish.emoji} ${CATEGORY_LABELS[dish.category]} · ${dish.cookingMethod} · Khoảng ${dish.estimatedTime} phút · ${dish.difficulty === 'easy' ? 'Dễ làm' : dish.difficulty === 'medium' ? 'Trung bình' : 'Cầu kỳ'}`);
  const title = el('strong', null, 'Nguyên liệu được khai báo');
  const ingredients = el('div', 'ingredient-list');
  dish.ingredients.forEach(s => ingredients.append(el('span', 'ingredient-badge', s)));
  dom.dialogContent.append(info, title, ingredients);
  dom.dialogContent.append(el('p', 'dialog-help', 'Thời gian là ước tính. Danh sách nguyên liệu không bao gồm định lượng và có thể cần thêm gia vị tùy cách nấu.'));
  const back = button('← Về danh sách món', 'mini-button', 'explore');
  const actions = el('div', 'dialog-bottom-actions'); actions.append(back); dom.dialogContent.append(actions);
}

function classifyIngredient(s) {
  const v = s.toLocaleLowerCase('vi');
  if (/thịt|gà|vịt|ngan|bò|sườn|xương|chân giò|móng giò|lòng|gan|tim|tai heo|giò sống|chim|dồi/.test(v)) return 'Thịt / gia cầm';
  if (/cá|tôm|tép|cua|ghẹ|mực|ngao|hến|sò|ốc|bạch tuộc|sứa/.test(v)) return 'Cá / hải sản';
  if (/rau|cải|bí|bầu|mướp|mồng tơi|nấm|su hào|cà rốt|khoai|giá đỗ|dưa chuột|dưa cải|hành tây|hoa chuối|súp lơ|củ cải|xà lách|măng|cà chua|chuối xanh|đu đủ|ngô|đỗ que|lá /.test(v)) return 'Rau củ / nấm';
  if (/gạo|bún|miến|mì|bánh đa|bánh phở|cốm|bột/.test(v)) return 'Tinh bột / ngũ cốc';
  if (/trứng|đậu phụ|đậu xanh|lạc|vừng/.test(v)) return 'Trứng / đậu / hạt';
  return 'Gia vị / khác';
}

function shoppingIngredients(meal) {
  const all = new Map();
  meal.items.forEach(i => i.dish.ingredients.forEach(raw => {
    const name = raw.trim().toLocaleLowerCase('vi');
    if (!all.has(name)) all.set(name, raw.trim());
  }));
  const groups = new Map();
  [...all.values()].sort((a, b) => a.localeCompare(b, 'vi')).forEach(name => {
    const group = classifyIngredient(name);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(name);
  });
  return groups;
}

function showShopping() {
  if (!state.currentMeal) return;
  const meal = state.currentMeal;
  const groups = shoppingIngredients(meal);
  openDialog('Danh sách đi chợ', 'CHUẨN BỊ CHO BỮA NGON');
  dom.dialogContent.append(el('p', 'dialog-help', `Danh sách nguyên liệu cho ${meal.settings.peopleCount} người. Chưa có dữ liệu định lượng nên không tự ước tính số gram hoặc số lượng cần mua.`));
  groups.forEach((names, group) => {
    dom.dialogContent.append(el('div', 'shopping-group', group));
    names.forEach(name => {
      const label = el('label', 'shopping-check'); const input = el('input'); input.type = 'checkbox';
      label.append(input, el('span', null, name)); dom.dialogContent.append(label);
    });
  });
  const copy = button('▤ Copy danh sách', 'mini-button', 'copy-shopping');
  const actions = el('div', 'dialog-bottom-actions'); actions.append(copy); dom.dialogContent.append(actions);
}

function doAction(action, target) {
  const dishId = target.dataset.dishId;
  switch (action) {
    case 'lock':
      state.currentMeal = toggleDishLock(state.currentMeal, dishId); saveState(state); renderMeal();
      toast(state.currentMeal.items.find(i => i.dish.id === dishId)?.locked ? 'Đã giữ nguyên món này 🔒' : 'Đã mở khóa món.'); break;
    case 'replace': replaceOne(dishId); break;
    case 'reroll': regenerate(); break;
    case 'reroll-all':
      if (state.currentMeal?.items.some(i => i.locked) && !window.confirm('Bạn đang khóa một số món. Bỏ khóa và random toàn bộ thực đơn?')) return;
      generateFresh(true); break;
    case 'unlock-all': state.currentMeal = unlockAllDishes(state.currentMeal); saveState(state); renderMeal(); toast('Đã mở khóa tất cả món.'); break;
    case 'save': saveFavorite(); break;
    case 'shopping': showShopping(); break;
    case 'share': shareMeal(); break;
    case 'detail': showDishDetail(dishId); break;
    case 'explore': showExplore(); break;
    case 'copy-shopping': {
      const groups = shoppingIngredients(state.currentMeal);
      copyText(['DANH SÁCH ĐI CHỢ', ...[...groups].flatMap(([group, names]) => ['', group, ...names.map(n => `☐ ${n}`)])].join('\n'));
      break;
    }
    case 'restore': {
      const list = target.dataset.list === 'favorites' ? state.favorites : state.history;
      const meal = list.find(m => m.id === target.dataset.mealId);
      if (!meal) break;
      state.currentMeal = { ...meal, items: meal.items.map(i => ({ ...i })) };
      state.settings = normalizeSettings(meal.settings);
      renderControls(); renderMeal(); saveState(state); dom.dialog.close();
      document.querySelector('#tao-thuc-don').scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast('Đã khôi phục thực đơn.'); break;
    }
    case 'remove-favorite':
      state.favorites = state.favorites.filter(m => m.id !== target.dataset.mealId);
      saveState(state); openSaved('favorites'); renderMeal(); toast('Đã xóa khỏi yêu thích.'); break;
  }
}

function init() {
  state.settings = normalizeSettings({ ...DEFAULT_SETTINGS, ...state.settings });
  renderControls(); applyTheme();
  $('#dish-total-description').textContent = `${DISHES.length} món và thành phần bữa ăn, từ món bình dị đến mâm cỗ thịnh soạn.`;

  dom.modes.addEventListener('click', event => {
    const target = event.target.closest('[data-mode]');
    if (!target) return;
    state.settings.mealType = target.dataset.mode;
    renderControls(); saveState(state); clearError();
  });
  dom.specialType.addEventListener('change', readControls);
  dom.mealSize.addEventListener('change', readControls);
  dom.cookingTime.addEventListener('change', readControls);
  dom.vegetarian.addEventListener('change', readControls);
  dom.exclusions.addEventListener('change', readControls);
  dom.people.addEventListener('change', readControls);
  $('#people-minus').addEventListener('click', () => { dom.people.value = Math.max(1, Number(dom.people.value || 4) - 1); readControls(); });
  $('#people-plus').addEventListener('click', () => { dom.people.value = Math.min(20, Number(dom.people.value || 4) + 1); readControls(); });
  $('#generate-button').addEventListener('click', () => generateFresh());
  $('#theme-button').addEventListener('click', () => { state.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(); saveState(state); });
  $('#explore-button').addEventListener('click', showExplore);
  $('#explore-bottom').addEventListener('click', showExplore);
  $('#favorites-button').addEventListener('click', () => openSaved('favorites'));
  $('#history-button').addEventListener('click', () => openSaved('history'));
  $('#dialog-close').addEventListener('click', () => dom.dialog.close());
  dom.dialog.addEventListener('click', event => { if (event.target === dom.dialog) dom.dialog.close(); });
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (target) doAction(target.dataset.action, target);
  });
  if (state.currentMeal) renderMeal();
  else acceptResult(generateMeal(state.settings, { previousMeals: state.history }));
}

init();
