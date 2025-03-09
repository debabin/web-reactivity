export const createDirtyChecker = (interval = 100) => {
  const watchedValues = new Map();

  const checkDirty = () => {
    for (const [key, { value, callback }] of watchedValues.entries()) {
      if (value !== watchedValues.get(key).lastValue) {
        callback(value, watchedValues.get(key).lastValue);
        watchedValues.get(key).lastValue = value;
      }
    }
  };

  const timer = setInterval(checkDirty, interval);

  return {
    watch: (key, value, callback) => watchedValues.set(key, { value, lastValue: value, callback }),
    update: (key, newValue) => {
      if (!watchedValues.has(key)) return;
      watchedValues.get(key).value = newValue;
    },
    stop: () => clearInterval(timer),
    getState: (key) => watchedValues.get(key).value
  };
};
