import { createStore, combineReducers } from './impl.js';

export const TODO_ACTION_TYPES = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM'
};

export const THEME_ACTION_TYPES = {
  TOGGLE_THEME: 'TOGGLE_THEME'
};

const itemReducer = (state, action) => {
  const handlers = {
    [TODO_ACTION_TYPES.ADD_ITEM]: (state, action) => [...state, action.item],
    [TODO_ACTION_TYPES.REMOVE_ITEM]: (state, action) =>
      state.filter((item) => item.id !== action.itemId),
    default: (state) => state
  };

  return (handlers[action.type] || handlers['default'])(state, action);
};

const themeReducer = (state, action) => {
  const handlers = {
    [THEME_ACTION_TYPES.TOGGLE_THEME]: (state) => (state === 'dark' ? 'light' : 'dark'),
    default: (state) => state
  };

  return (handlers[action.type] || handlers['default'])(state, action);
};

const reducers = combineReducers({
  items: itemReducer,
  theme: themeReducer
});

export const store = createStore(reducers, { items: [], theme: 'light' });

export const addItem = (item) => ({
  type: TODO_ACTION_TYPES.ADD_ITEM,
  item
});

export const removeItem = (itemId) => ({
  type: TODO_ACTION_TYPES.REMOVE_ITEM,
  itemId
});

export const toggleTheme = () => ({
  type: THEME_ACTION_TYPES.TOGGLE_THEME
});

store.dispatch(addItem({ id: 1, name: 'Item 1' }));
