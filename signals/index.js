import { signal } from './impl.js';

export const theme = signal('light');
export const items = signal([{ id: 1, name: 'Item 1' }]);

export const toggleTheme = () => {
  theme.set(theme() === 'light' ? 'dark' : 'light');
};

export const addItem = (item) => {
  items.update((current) => [...current, item]);
};

export const removeItem = (id) => {
  items.update((current) => current.filter((item) => item.id !== id));
};

window.removeItem = removeItem;
