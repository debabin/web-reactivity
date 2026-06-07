const toObserver = (observer) =>
  typeof observer === 'function' ? { next: observer } : observer;

export const createObservable = (subscribeFn) => {
  const observable = {
    subscribe(observer) {
      return subscribeFn(toObserver(observer)) ?? (() => {});
    },
    pipe(...operators) {
      return operators.reduce((source, operator) => operator(source), observable);
    }
  };

  return observable;
};

export const createSubject = () => {
  const observers = new Set();

  const subject = createObservable((observer) => {
    observers.add(observer);
    return () => observers.delete(observer);
  });

  subject.next = (value) => {
    observers.forEach((observer) => observer.next(value));
  };

  return subject;
};

export const createBehaviorSubject = (initialValue) => {
  let currentValue = initialValue;
  const observers = new Set();

  const subject = createObservable((observer) => {
    observers.add(observer);
    observer.next(currentValue);
    return () => observers.delete(observer);
  });

  subject.getValue = () => currentValue;
  subject.next = (value) => {
    currentValue = value;
    observers.forEach((observer) => observer.next(value));
  };

  return subject;
};

export const scan = (reducer, seed) => (source$) => {
  const output$ = createBehaviorSubject(seed);

  source$.subscribe({
    next: (value) => {
      output$.next(reducer(output$.getValue(), value));
    }
  });

  return output$;
};

export const createHotStore = (reducer, initialState) => {
  const action$ = createSubject();
  const state$ = action$.pipe(scan(reducer, initialState));

  return {
    action$,
    state$,
    dispatch: (action) => {
      console.log('\ndispatching action', action, '\n');
      action$.next(action);
    },
    getState: () => state$.getValue(),
    subscribe: (listener) => state$.subscribe(listener)
  };
};

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
