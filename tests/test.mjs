import test from 'node:test';
import assert from 'node:assert/strict';
import { DISHES, DISH_BY_ID, DATA_STATS, isDishAllowed } from '../js/data.js';
import { generateMeal, regenerateUnlocked, replaceDish, toggleDishLock, unlockAllDishes, estimateMealTime, reviveMeal, mealSignature } from '../js/generator.js';
import { serializeMeal } from '../js/storage.js';

const allModes = [
  { mealType: 'family' }, { mealType: 'special', specialType: 'feast' },
  { mealType: 'special', specialType: 'hotpot' }, { mealType: 'special', specialType: 'barbecue' },
  { mealType: 'special', specialType: 'delicacy' }, { mealType: 'nhau' }, { mealType: 'quick' }
];

test('Kho dữ liệu >=250 mục, không trùng ID/tên, metadata hợp lệ, không có giá', () => {
  assert.ok(DISHES.length >= 250);
  assert.equal(new Set(DISHES.map(d => d.id)).size, DISHES.length);
  assert.equal(new Set(DISHES.map(d => d.name.toLowerCase())).size, DISHES.length);
  assert.equal(DISH_BY_ID.size, DISHES.length);
  assert.ok(DATA_STATS['pork-beef'] >= 45);
  assert.ok(DATA_STATS.poultry >= 25);
  assert.ok(DATA_STATS['fish-seafood'] >= 45);
  assert.ok(DATA_STATS['egg-tofu'] >= 25);
  assert.ok(DATA_STATS.vegetables >= 35);
  assert.ok(DATA_STATS.soups >= 35);
  assert.ok(DATA_STATS.hotpot + DATA_STATS.barbecue + DATA_STATS.appetizer >= 25);
  assert.ok(DATA_STATS.staples + DATA_STATS.sides >= 15);
  DISHES.forEach(d => {
    assert.ok(d.name && d.role && d.category);
    assert.ok(Array.isArray(d.ingredients) && d.ingredients.length);
    assert.ok(Array.isArray(d.nutritionGroups) && Array.isArray(d.mealTypes));
    assert.ok(Number.isFinite(d.estimatedTime) && d.estimatedTime > 0);
    assert.ok(!Object.hasOwn(d, 'estimatedCost') && !Object.hasOwn(d, 'price'));
    assert.equal(d.servings, 4);
  });
});

test('Nhận diện cá khác cà chua và loại trừ nước mắm', () => {
  const tomato = DISHES.find(d => d.name === 'Đậu phụ sốt cà chua');
  const fish = DISHES.find(d => d.name === 'Cá trắm kho riềng');
  assert.ok(!tomato.ingredientGroups.includes('fish'));
  assert.ok(fish.ingredientGroups.includes('fish'));
  assert.ok(!isDishAllowed(fish, { excludedIngredients: ['fish'] }));
  assert.ok(isDishAllowed(tomato, { excludedIngredients: ['fish'] }));
});

test('1000 lần random thuộc nhiều chế độ có cấu trúc và tính ngẫu nhiên', () => {
  const variants = new Set();
  for (let i = 0; i < 1000; i++) {
    const options = allModes[i % allModes.length];
    const result = generateMeal(options);
    assert.ok(result.ok, `${JSON.stringify(options)} => ${result.message}`);
    const meal = result.meal;
    const ids = meal.items.map(i => i.dish.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(meal.items.every(i => i.dish.mealTypes.includes(options.mealType)));
    assert.ok(meal.balance.checks.some(c => c.key === 'protein' && c.ok));
    assert.ok(meal.balance.checks.some(c => c.key === 'vegetables' && c.ok));
    assert.ok(meal.estimatedMinutes === estimateMealTime(meal.items));
    if (options.mealType === 'special' && options.specialType === 'hotpot') {
      assert.equal(meal.items.filter(i => i.role === 'hotpot').length, 1);
      assert.ok(meal.items.filter(i => i.role === 'dippingVeg').length >= 2);
      assert.ok(meal.items.filter(i => i.role === 'staple').every(i => /bún|miến|mì|bánh đa|bánh phở/i.test(i.dish.name)));
    }
    if (options.mealType === 'quick') assert.ok(meal.estimatedMinutes <= 30);
    variants.add(mealSignature(meal.items));
  }
  assert.ok(variants.size > 500, `Chỉ có ${variants.size} thực đơn khác nhau`);
});

test('Bộ lọc thịt, cá, hải sản, trứng và nội tạng không bị vi phạm', () => {
  for (const exclude of ['pork', 'beef', 'fish', 'seafood', 'egg', 'offal', 'spicy']) {
    for (let i = 0; i < 20; i++) {
      const result = generateMeal({ mealType: 'family', excludedIngredients: [exclude] });
      assert.ok(result.ok, `${exclude}: ${result.message}`);
      assert.ok(result.meal.items.every(item => !item.dish.ingredientGroups.includes(exclude)));
    }
  }
});

test('Bữa ăn chay không có nguyên liệu động vật', () => {
  for (const type of ['family', 'quick']) {
    for (let i = 0; i < 20; i++) {
      const result = generateMeal({ mealType: type, vegetarian: true });
      assert.ok(result.ok, `${type}: ${result.message}`);
      assert.ok(result.meal.items.every(i => i.dish.vegetarian));
    }
  }
});

test('Khóa một món rồi random 100 lần không làm thay món khóa', () => {
  const first = generateMeal({ mealType: 'family' });
  assert.ok(first.ok);
  const original = first.meal.items[1].dish.id;
  let meal = toggleDishLock(first.meal, original);
  for (let i = 0; i < 100; i++) {
    const next = regenerateUnlocked(meal, meal.settings);
    assert.ok(next.ok, next.message);
    meal = next.meal;
    assert.ok(meal.items.find(i => i.dish.id === original)?.locked);
  }
  const lockedAll = { ...meal, items: meal.items.map(i => ({ ...i, locked: true })) };
  assert.equal(regenerateUnlocked(lockedAll).code, 'ALL_LOCKED');
  assert.ok(unlockAllDishes(lockedAll).items.every(i => !i.locked));
});

test('Khóa nhiều món, random giữ nguyên toàn bộ', () => {
  let meal = generateMeal({ mealType: 'family' }).meal;
  const ids = [meal.items[0].dish.id, meal.items[2].dish.id];
  ids.forEach(id => { meal = toggleDishLock(meal, id); });
  for (let i = 0; i < 30; i++) {
    const next = regenerateUnlocked(meal);
    assert.ok(next.ok, next.message);
    meal = next.meal;
    ids.forEach(id => assert.ok(meal.items.some(item => item.dish.id === id && item.locked)));
  }
});

test('Thay riêng một món không làm thay đổi những món còn lại', () => {
  let meal = generateMeal({ mealType: 'family' }).meal;
  const target = meal.items[1].dish.id;
  const oldOthers = meal.items.filter(i => i.dish.id !== target).map(i => `${i.slotId}:${i.dish.id}`).sort();
  const next = replaceDish(meal, target);
  assert.ok(next.ok, next.message);
  assert.ok(!next.meal.items.some(i => i.dish.id === target));
  assert.deepEqual(next.meal.items.filter(i => i.dish.id !== next.meal.items[1].dish.id).map(i => `${i.slotId}:${i.dish.id}`).sort(), oldOthers);
});

test('Giới hạn thời gian 30 phút và trường hợp xung đột', () => {
  const result = generateMeal({ mealType: 'family', maxCookingTime: 30, mealSize: 'compact' });
  assert.ok(result.ok, result.message);
  assert.ok(result.meal.estimatedMinutes <= 30);
  const range = generateMeal({ mealType: 'family', maxCookingTime: 60, minCookingTime: 30 });
  assert.ok(range.ok, range.message);
  assert.ok(range.meal.estimatedMinutes >= 30 && range.meal.estimatedMinutes <= 60);
  assert.equal(generateMeal({ mealType: 'quick', minCookingTime: 61 }).code, 'CONFLICT');
});

test('Dữ liệu lưu/khôi phục không đổi món, trạng thái khóa và metadata', () => {
  let meal = generateMeal({ mealType: 'family' }).meal;
  meal = toggleDishLock(meal, meal.items[0].dish.id);
  const restored = reviveMeal(serializeMeal(meal));
  assert.ok(restored);
  assert.deepEqual(restored.items.map(i => [i.dish.id, i.locked]), meal.items.map(i => [i.dish.id, i.locked]));
  assert.equal(reviveMeal({ items: [{ dishId: 'unknown', role: 'main', slotId: 'main-0' }] }), null);
});
