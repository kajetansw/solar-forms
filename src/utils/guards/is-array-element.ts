import { JSX } from 'solid-js';

export default function isArrayElement(el: unknown): el is JSX.ArrayElement {
  return el && typeof el === 'object' && (el as any)['length'];
}
