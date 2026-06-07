import { createEvent, createStore, when } from './impl.js';

export const themeToggled = createEvent('themeToggled');
export const itemAdded = createEvent('itemAdded');
export const itemRemoved = createEvent('itemRemoved');
export const todoSubmitted = createEvent('todoSubmitted');

export const themeStore = createStore('light', 'themeStore');
export const itemsStore = createStore([{ id: 1, name: 'Item 1' }], 'itemsStore');

themeStore.reduceOn(themeToggled, (theme) => (theme === 'light' ? 'dark' : 'light'));

itemsStore.reduceOn(itemAdded, (items, { name }) => [...items, { id: Date.now(), name }]);

itemsStore.reduceOn(itemRemoved, (items, id) => items.filter((item) => item.id !== id));

when({
  trigger: todoSubmitted,
  transform: (_, text) => ({ name: text.trim() }),
  guard: (_, text) => text.trim().length > 0,
  to: itemAdded
});

window.removeItem = (id) => itemRemoved(id);
