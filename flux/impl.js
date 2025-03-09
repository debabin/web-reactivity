const createDispatcher = () => {
  const callbacks = [];

  const register = (callback) => {
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  };

  const dispatch = (action) => {
    callbacks.forEach((callback) => callback(action));
  };

  return {
    register,
    dispatch
  };
};

export const dispatcher = createDispatcher();

export const combineReducers = (reducers) => {
  return (state = {}, action) => {
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
};

export const createStore = (reducer, initialState = {}) => {
  let currentState = initialState;
  let listeners = [];

  const getState = () => {
    return currentState;
  };

  const dispatch = (action) => {
    console.log('\ndispatching action', action, '\n');
    currentState = reducer(currentState, action);
    listeners.forEach((listener) => listener());
    return action;
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  return {
    getState,
    dispatch,
    subscribe
  };
};
