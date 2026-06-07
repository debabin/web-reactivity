// MVC: Model хранит state и уведомляет подписчиков.
// View и Controller живут снаружи (usage.js / index.js).

export const createModel = (initialState) => {
  let state = { ...initialState };
  const listeners = [];

  return {
    getState: () => state,
    setState: (partial) => {
      state = { ...state, ...partial };
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    }
  };
};
