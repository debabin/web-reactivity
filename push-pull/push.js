// Push: тот же pipeline, но producer шлёт значения подписчику (RxJS).

import { filter, from, map, take } from 'https://esm.sh/rxjs@7.8.1';

export const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const pipeline = from(source).pipe(
  filter((x) => x % 2 === 0),
  map((x) => x * 2),
  take(3)
);

// subscribe = «я готов слушать» → значения приходят сами
export const run = (onNext, onComplete) => {
  const values = [];

  pipeline.subscribe({
    next: (value) => {
      values.push(value);
      onNext(value, [...values]);
    },
    complete: () => onComplete?.(values)
  });
};
