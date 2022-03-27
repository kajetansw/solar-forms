export function getFormControlName(el: Element): string | undefined {
  return el.attributes.getNamedItem('formControlName')?.value;
}
