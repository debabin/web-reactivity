// MVP: View пассивный — только события наружу и команды отображения внутрь.
// Presenter знает и о Model, и о View; Model не знает о View.

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

export const createPresenter = (model) => ({
  attach(view, handlers) {
    // View → Presenter: события UI без знания о model
    view.onThemeToggle(() => {
      model.setState(handlers.onThemeToggle(model.getState()));
    });

    view.onAddItem((text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      model.setState(handlers.onAddItem(model.getState(), trimmed));
      view.clearInput();
    });

    view.onRemoveItem((id) => {
      model.setState(handlers.onRemoveItem(model.getState(), id));
    });

    // Presenter → View: явно обновляем UI после изменения model
    const render = (state) => {
      view.setTheme(state.theme);
      view.setItems(state.items);
    };

    model.subscribe(render);
    render(model.getState());
  }
});
