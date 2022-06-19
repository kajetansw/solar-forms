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

function isTextArea(child: JSX.Element): child is HTMLTextAreaElement {
  return child instanceof HTMLTextAreaElement;
}

function getAssociatedControlForLabel(label: HTMLLabelElement) {
  return Array.from(label.children).find((c) => c.id === label.htmlFor);
}

/**
 * Extracts form control from the HTML element. Identifies:
 * - standalone `input`, `select` and `textarea` elements
 * - `label`s with form elements as children bound by `htmlFor`/`for` attribute.
 */
export function getFormControl(
  child: JSX.Element
): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  if (isInput(child) || isSelect(child) || isTextArea(child)) {
    return child;
  }
  if (isLabel(child)) {
    const control = getAssociatedControlForLabel(child);
    if (isInput(control) || isSelect(control) || isTextArea(control)) {
      return control;
    }
  }
  return null;
}
