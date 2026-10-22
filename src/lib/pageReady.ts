// Tiny pub/sub so load-time animations wait for the page cover to lift.
let ready = false;
const subscribers = new Set<() => void>();

export function onPageReady(cb: () => void) {
  if (ready) {
    cb();
    return () => {};
  }
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function setPageReady(value: boolean) {
  ready = value;
  if (value) {
    subscribers.forEach((cb) => cb());
    subscribers.clear();
  }
}
