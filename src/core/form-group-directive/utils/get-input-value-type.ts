export type InputValueType = 'string' | 'number' | 'boolean' | 'date' | 'radio' | 'datetime-local';

export function getInputValueType(inputElementType: HTMLInputElement['type']): InputValueType | undefined {
  switch (inputElementType) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
    case 'time':
      return 'string';
    case 'checkbox':
      return 'boolean';
    case 'number':
    case 'range':
      return 'number';
    case 'radio':
      return 'radio';
    case 'date':
      return 'date';
    case 'datetime-local':
      return 'datetime-local';
    default:
      return undefined;
  }
}
