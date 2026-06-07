import { createModel } from './impl.js';

export const model = createModel({
  theme: 'light',
  items: [{ id: 1, name: 'Item 1' }]
});

export const toggleTheme = () => {
  const { theme } = model.getState();
  model.setState({ theme: theme === 'light' ? 'dark' : 'light' });
};

export const addItem = (item) => {
  const { items } = model.getState();
  model.setState({ items: [...items, item] });
};

export const removeItem = (id) => {
  const { items } = model.getState();
  model.setState({ items: items.filter((item) => item.id !== id) });
};

window.removeItem = removeItem;
