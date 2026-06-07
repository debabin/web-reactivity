import { createModel, createPresenter } from './impl.js';

const model = createModel({
  theme: 'light',
  items: [{ id: 1, name: 'Item 1' }]
});

const presenter = createPresenter(model);

export const attachView = (view) => {
  presenter.attach(view, {
    onThemeToggle: (state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light'
    }),
    onAddItem: (state, text) => ({
      items: [...state.items, { id: Date.now(), name: text }]
    }),
    onRemoveItem: (state, id) => ({
      items: state.items.filter((item) => item.id !== id)
    })
  });
};
