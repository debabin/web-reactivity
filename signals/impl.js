// Signals: pull-push реактивность.
// read() — pull (ленивый пересчёт), set/invalidate — push подписчикам.

let activeConsumer = null;

export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  const read = () => {
    // При чтении внутри effect/computed — регистрируем зависимость
    if (activeConsumer) {
      subscribers.add(activeConsumer);
      activeConsumer.deps.add(subscribers);
    }
    return value;
  };

  read.set = (next) => {
    const resolved = typeof next === 'function' ? next(value) : next;
    if (Object.is(resolved, value)) return;
    value = resolved;
    subscribers.forEach((subscriber) => subscriber.run());
  };

  read.update = (updater) => read.set(updater(value));

  return read;
};

export const computed = (compute) => {
  let value;
  let dirty = true;
  const subscribers = new Set();
  const deps = new Set();

  const invalidate = () => {
    if (dirty) return;
    dirty = true;
    subscribers.forEach((subscriber) => subscriber.run());
  };

  const read = () => {
    if (activeConsumer) {
      subscribers.add(activeConsumer);
      activeConsumer.deps.add(subscribers);
    }

    // Pull: пересчитываем только когда dirty и кто-то читает
    if (dirty) {
      deps.forEach((dep) => dep.delete(read));
      deps.clear();

      const prev = activeConsumer;
      activeConsumer = read;
      try {
        value = compute();
        dirty = false;
      } finally {
        activeConsumer = prev;
      }
    }

    return value;
  };

  read.deps = deps;
  read.run = invalidate;

  return read;
};

export const effect = (fn) => {
  let cleanup;

  const run = () => {
    if (cleanup) cleanup();
    run.deps.forEach((dep) => dep.delete(run));
    run.deps.clear();

    const prev = activeConsumer;
    activeConsumer = run;
    try {
      cleanup = fn();
    } finally {
      activeConsumer = prev;
    }
  };

  run.deps = new Set();
  run.run = run;

  run();

  return () => {
    run.deps.forEach((dep) => dep.delete(run));
    if (cleanup) cleanup();
  };
};
