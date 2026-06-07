// Kernel inspired by E~wee~ctor:
// https://dev.to/effector/e-wee-ctor-writing-tiny-effector-from-scratch-1-1kap

const graph = {
  nodes: [],
  links: []
};

let nodeId = 0;

export const createNode = ({ kind, meta = {}, next = [], seq = [] } = {}) => {
  const node = { id: ++nodeId, kind, meta, next, seq };
  graph.nodes.push(node);
  return node;
};

const link = (from, to, type) => {
  graph.links.push({ from: from.id, to: to.id, type });
};

const queue = [];

const exec = () => {
  while (queue.length) {
    const { node, value } = queue.shift();
    let current = value;

    for (const step of node.seq) {
      current = step(current);
    }

    for (const nextNode of node.next) {
      queue.push({ node: nextNode, value: current });
    }
  }
};

export const launch = (unit, value) => {
  queue.push({ node: unit.node, value });
  exec();
};

const addWatch = (unit, meta) => (handler) => {
  const watchNode = createNode({
    kind: 'subscribe',
    meta: { label: `subscribe(${meta})`, ...meta },
    seq: [
      (value) => {
        handler(value);
        return value;
      }
    ]
  });

  unit.node.next.push(watchNode);
  link(unit.node, watchNode, 'subscribe');
};

export const getGraph = () => ({
  nodes: graph.nodes.map(({ id, kind, meta, seq, next }) => ({
    id,
    kind,
    steps: seq.length,
    next: next.map((node) => node.id),
    ...meta
  })),
  links: graph.links.map(({ from, to, type }) => ({ from, to, type }))
});

export const formatGraph = () => {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));

  const label = (node) => {
    if (node.meta.label) return node.meta.label;
    if (node.kind === 'reduce') return `reduce(${node.meta.event} → ${node.meta.store})`;
    if (node.kind === 'when') return `when(${node.meta.trigger} → ${node.meta.to})`;
    if (node.kind === 'forward') return `forward(${node.meta.to})`;
    return node.kind;
  };

  return graph.links
    .map(({ from, to, type }) => `[${label(byId.get(from))}] --${type}--> [${label(byId.get(to))}]`)
    .join('\n');
};

export const createEvent = (name) => {
  const event = (payload) => launch(event, payload);

  event.node = createNode({
    kind: 'event',
    meta: { name, label: name }
  });

  event.subscribe = addWatch(event, name);
  return event;
};

export const createStore = (defaultState, name) => {
  let currentState = defaultState;

  const store = {
    node: createNode({
      kind: 'store',
      meta: { name, label: name },
      seq: [
        (value) => {
          currentState = value;
          return value;
        }
      ]
    }),
    getState: () => currentState,
    set: (value) => launch(store, value),
    reduceOn(event, reducer) {
      const reduceNode = createNode({
        kind: 'reduce',
        meta: { event: event.node.meta.name, store: name, label: `reduce(${event.node.meta.name} → ${name})` },
        next: [store.node],
        seq: [(payload) => reducer(currentState, payload)]
      });

      event.node.next.push(reduceNode);
      link(event.node, reduceNode, 'reduce');
      link(reduceNode, store.node, 'reduce');

      return store;
    },
    subscribe(handler) {
      handler(currentState);
      addWatch(store, name)(handler);
    }
  };

  return store;
};

export const when = ({ trigger, read, transform, guard, to }) => {
  const targetLabel = to.node?.meta?.label ?? to.node?.meta?.name ?? 'target';

  const whenNode = createNode({
    kind: 'when',
    meta: { trigger: trigger.node.meta.name, to: targetLabel, label: `when(${trigger.node.meta.name} → ${targetLabel})` },
    seq: [
      (triggerPayload) => {
        const data = read ? read.getState() : triggerPayload;
        if (guard && !guard(data, triggerPayload)) return;
        return transform ? transform(data, triggerPayload) : data;
      }
    ]
  });

  const forwardNode = createNode({
    kind: 'forward',
    meta: { to: targetLabel, label: `forward(${targetLabel})` },
    seq: [
      (value) => {
        if (value !== undefined) launch(to, value);
        return value;
      }
    ]
  });

  whenNode.next.push(forwardNode);
  trigger.node.next.push(whenNode);

  link(trigger.node, whenNode, 'when');
  link(whenNode, forwardNode, 'forward');

  if (read?.node) {
    link(read.node, whenNode, 'when-read');
  }

  if (to.node) {
    link(forwardNode, to.node, 'when-send');
  }
};
