import { createDirtyChecker } from './impl.js';

export const dirtyChecker = createDirtyChecker(100);

export const toggleTheme = () =>
  dirtyChecker.update('theme', dirtyChecker.getState('theme') === 'light' ? 'dark' : 'light');

export function addItem(item) {
  dirtyChecker.update('items', [...dirtyChecker.getState('items'), item]);
}

export function removeItem(id) {
  dirtyChecker.update(
    'items',
    dirtyChecker.getState('items').filter((item) => item.id !== id)
  );
}

dirtyChecker.update('items', [{ id: 1, name: 'Item 1' }]);

window.removeItem = removeItem;
