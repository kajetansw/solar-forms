import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';

describe('"maxLength" validator', () => {
  it('should return "null" if form control value length is lower than maximum from validator', () => {
    const formControl = getFormControlWithValue('test');

    expect(V.maxLength(10)(formControl)).toBe(null);
  });

  it('should return "null" if form control value length is equal to maximum from validator', () => {
    const formControl = getFormControlWithValue('test');

    expect(V.maxLength(4)(formControl)).toBe(null);
  });

  it('should return error if form control value length is bigger than maximum from validator', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.maxLength(3)(formControl);

    expect(output?.maxLength).toBeTruthy();
  });

  it('should return "null" if form control value is "null"', () => {
    const formControl = getFormControlWithValue(null);
    const output = V.maxLength(10)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "number"', () => {
    const formControl = getFormControlWithValue(10);
    const output = V.maxLength(10)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "boolean"', () => {
    const formControl = getFormControlWithValue(true);
    const output = V.maxLength(10)(formControl);

    expect(output).toBe(null);
  });
});
