function createDispatcher() {
  const callbacks = [];

  function register(callback) {
    callbacks.push(callback);
    return function unregister() {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  function dispatch(action) {
    callbacks.forEach((callback) => callback(action));
  }

  return {
    register,
    dispatch
  };
}

export const dispatcher = createDispatcher();

export function combineReducers(reducers) {
  return function combinedReducer(state = {}, action) {
    const nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

export function createStore(reducer, initialState = {}) {
  let currentState = initialState;
  let listeners = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    console.log('\ndispatching action', action, '\n');
    currentState = reducer(currentState, action);
    listeners.forEach((listener) => listener());
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return {
    getState,
    dispatch,
    subscribe
  };
}
