import * as push from './push.js';
import * as pull from './pull.js';

const pushOutput = document.getElementById('push-output');
const iteratorOutput = document.getElementById('iterator-output');
const promiseOutput = document.getElementById('promise-output');

push.run(
  (value, all) => {
    pushOutput.textContent = `[${all.join(', ')}]  ← emit ${value}`;
  },
  (all) => {
    pushOutput.textContent = `[${all.join(', ')}]`;
  }
);

iteratorOutput.textContent = `[${pull.runIterator().join(', ')}]`;

pull.runPromise().then((value) => {
  promiseOutput.textContent = `${pull.single} → ${value}`;
});
