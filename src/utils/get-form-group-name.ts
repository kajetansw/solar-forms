export default function getFormGroupName(el: Element): string | undefined {
  return el.attributes.getNamedItem('formGroupName')?.value;
}
