export function fireInputEvent($input: HTMLElement, value: string | number) {
  if (typeof value === 'string') {
    ($input as HTMLInputElement).value = value;
  }
  if (typeof value === 'number') {
    ($input as HTMLInputElement).valueAsNumber = value;
  }
  $input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}
