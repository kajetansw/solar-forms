export type InputType = 'text' | 'checkbox' | 'number' | 'email' | 'password' | 'tel' | 'url';
export type InputValueType = 'string' | 'number' | 'boolean' | 'date';

export function getInputValueType(inputElementType: HTMLInputElement['type']): InputValueType | undefined {
  switch (inputElementType) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
      return 'string';
    case 'checkbox':
      return 'boolean';
    case 'number':
      return 'number';
    default:
      return undefined;
  }
}
