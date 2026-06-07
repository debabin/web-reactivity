// Pull: те же шаги pipeline, consumer сам забирает результат.
// Iterator — много значений; Promise — один раз, одно значение (.then chain).

export const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const single = 6;

// Общие шаги — аналог filter / map в RxJS
const filterEven = (x) => {
  if (x % 2 !== 0) throw new Error('filtered out');
  return x;
};

const double = (x) => x * 2;

// Iterator helpers: pull по коллекции, take(3) как в pipe
export const runIterator = () =>
  Iterator.from(source)
    .filter((x) => x % 2 === 0)
    .map(double)
    .take(3)
    .toArray();

// Promise: тот же filter → map, но 1 значение, 1 проход, await забирает результат
export const runPromise = () =>
  Promise.resolve(single).then(filterEven).then(double);
