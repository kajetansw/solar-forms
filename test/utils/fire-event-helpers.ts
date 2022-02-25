export function fireDateInputEvent($input: HTMLElement, value: string) {
  ($input as HTMLInputElement).value = value;
  $input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}
