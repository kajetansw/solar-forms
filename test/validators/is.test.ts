import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';
import getRandomNumber from '../utils/get-random-number';
import getRandomString from '../utils/get-random-string';

describe('"is" validator', () => {
  it('should return "null" if form control value is "string" and equal to one from validator', () => {
    const testValue = getRandomString();
    const formControl = getFormControlWithValue(testValue);
    const output = V.is(testValue)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if form control value is "number" and equal to one from validator', () => {
    const testValue = getRandomNumber();
    const formControl = getFormControlWithValue(testValue);
    const output = V.is(testValue)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if form control value is "boolean" and equal to one from validator', () => {
    const testValue = Math.random() > 0.5;
    const formControl = getFormControlWithValue(testValue);
    const output = V.is(testValue)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if form control value is "null" and equal to one from validator', () => {
    const testValue = null;
    const formControl = getFormControlWithValue(testValue);
    const output = V.is(testValue)(formControl);

    expect(output).toBe(null);
  });

  it('should return error if form control does not equal to one from validator', () => {
    const random = Math.random() < 0.5;
    const formControl = getFormControlWithValue(random ? getRandomNumber() : null);
    const output = V.is(random ? getRandomString() : random)(formControl);

    expect(output?.is).toBeTruthy();
  });
});
