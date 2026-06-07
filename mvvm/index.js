import { createObservable } from './impl.js';

const theme = createObservable('light');
const items = createObservable([{ id: 1, name: 'Item 1' }]);

export const viewModel = {
  subscribeTheme: (subscriber) => theme.subscribe(subscriber),
  subscribeItems: (subscriber) => items.subscribe(subscriber),
  toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  },
  addItem(item) {
    items.value = [...items.value, item];
  },
  removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }
};

window.removeItem = (id) => viewModel.removeItem(id);
