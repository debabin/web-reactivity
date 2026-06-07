export const createObservable = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  return {
    get value() {
      return value;
    },
    set value(next) {
      if (Object.is(next, value)) return;
      value = next;
      subscribers.forEach((subscriber) => subscriber(value));
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      subscriber(value);
      return () => subscribers.delete(subscriber);
    }
  };
};
