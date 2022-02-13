export type InputType = 'text' | 'checkbox' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'radio';
export type InputValueType = 'string' | 'number' | 'boolean' | 'date' | 'radio';

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
    case 'range':
      return 'number';
    case 'radio':
      return 'radio';
    default:
      return undefined;
  }
}
