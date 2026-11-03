/* Lưu dữ liệu cục bộ, thất bại đọc/ghi không làm website dừng hoạt động. */
import { normalizeSettings, reviveMeal } from './generator.js';

const PREFIX = 'hom-nay-an-gi:v2:';

function read(key, fallback) {
  try { const raw = localStorage.getItem(PREFIX + key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}

function write(key, data) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(data)); return true; }
  catch { return false; }
}

export function serializeMeal(meal) {
  if (!meal) return null;
  return {
    id: meal.id, createdAt: meal.createdAt, style: meal.style,
    settings: meal.settings,
    items: meal.items.map(i => ({ slotId: i.slotId, role: i.role, dishId: i.dish.id, locked: i.locked }))
  };
}

export function loadState() {
  const history = read('history', []);
  const favorites = read('favorites', []);
  return {
    settings: normalizeSettings(read('settings', {})),
    theme: ['light', 'dark', 'system'].includes(read('theme', 'system')) ? read('theme', 'system') : 'system',
    currentMeal: reviveMeal(read('current', null)),
    history: Array.isArray(history) ? history.slice(0, 30).map(reviveMeal).filter(Boolean) : [],
    favorites: Array.isArray(favorites) ? favorites.slice(0, 100).map(reviveMeal).filter(Boolean) : []
  };
}

export function saveState(state) {
  const outputs = [
    write('settings', normalizeSettings(state.settings)),
    write('theme', state.theme),
    write('current', serializeMeal(state.currentMeal)),
    write('history', state.history.slice(0, 30).map(serializeMeal)),
    write('favorites', state.favorites.slice(0, 100).map(serializeMeal))
  ];
  return outputs.every(Boolean);
}
