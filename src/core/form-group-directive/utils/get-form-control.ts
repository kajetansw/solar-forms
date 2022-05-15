import { JSX } from 'solid-js';

function isInput(child: JSX.Element): child is HTMLInputElement {
  return child instanceof HTMLInputElement;
}

function isLabel(child: JSX.Element): child is HTMLLabelElement {
  return child instanceof HTMLLabelElement;
}

function isSelect(child: JSX.Element): child is HTMLSelectElement {
  return child instanceof HTMLSelectElement;
}

function getAssociatedControlForLabel(label: HTMLLabelElement) {
  return Array.from(label.children).find((c) => c.id === label.htmlFor);
}

/**
 * Extracts form control from the HTML element. Identifies:
 * - standalone `input` elements
 * - `label`s with `input`s as children bound by `htmlFor` attribute.
 */
export function getFormControl(child: JSX.Element): HTMLInputElement | HTMLSelectElement | null {
  if (isInput(child)) {
    return child;
  }
  if (isSelect(child)) {
    return child;
  }
  if (isLabel(child)) {
    const control = getAssociatedControlForLabel(child);
    if (isInput(control)) {
      return control;
    }
  }
  return null;
}
