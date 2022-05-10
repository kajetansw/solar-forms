import { JSX } from 'solid-js';

export function isArrayElement(el: unknown): el is JSX.ArrayElement {
  // eslint-disable-next-line
  return el && typeof el === 'object' && (el as any)['length'];
}
