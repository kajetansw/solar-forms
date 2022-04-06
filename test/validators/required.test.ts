import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';
import getRandomNumber from '../utils/get-random-number';

describe('"required" validator', () => {
  it('should return "null" if form control value is non-empty string', () => {
    const formControl = getFormControlWithValue('test');

    expect(V.required(formControl)).toBe(null);
  });

  it('should return error object if form control value is an empty string', () => {
    const formControl = getFormControlWithValue('');
    const output = V.required(formControl);

    expect(output?.required).toBeTruthy();
  });

  it('should return error object if form control value is "null"', () => {
    const formControl = getFormControlWithValue(null);
    const output = V.required(formControl);

    expect(output?.required).toBeTruthy();
  });

  it('should return "null" if form control value is 0', () => {
    const formControl = getFormControlWithValue(0);

    expect(V.required(formControl)).toBe(null);
  });

  it('should return "null" if form control value is number', () => {
    const formControl = getFormControlWithValue(getRandomNumber());

    expect(V.required(formControl)).toBe(null);
  });

  it('should return "null" if form control value is boolean', () => {
    let formControl = getFormControlWithValue(true);
    expect(V.required(formControl)).toBe(null);

    formControl = getFormControlWithValue(false);
    expect(V.required(formControl)).toBe(null);
  });

  it('should return "null" if form control value is Date', () => {
    const formControl = getFormControlWithValue(new Date());

    expect(V.required(formControl)).toBe(null);
  });
});
