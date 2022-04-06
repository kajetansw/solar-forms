import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';
import getRandomNumber from '../utils/get-random-number';
import getRandomString from '../utils/get-random-string';

describe('"isAnyOf" validator', () => {
  it('should return "null" if form control value is "string" and matches one of values provided in validator', () => {
    const formControl = getFormControlWithValue('test1');
    const output = V.isAnyOf(['test1', 'test2', 'test3'])(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if form control value is "number" and matches one of values provided in validator', () => {
    const formControl = getFormControlWithValue(0);
    const output = V.isAnyOf([0, 1, 2])(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if form control value is "string" and values provided in validator are "number[]"', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.isAnyOf([0, 1, 2])(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if form control value is "number" and values provided in validator are "string[]"', () => {
    const formControl = getFormControlWithValue(1);
    const output = V.isAnyOf(['test1', 'test2', 'test3'])(formControl);

    expect(output).toBe(null);
  });

  it('should return error if form control value is "string" and does not match any of values provided in validator', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.isAnyOf(['test1', 'test2', 'test3'])(formControl);

    expect(output?.isAny).toBeTruthy();
  });

  it('should return error if form control value is "number" and does not match any of values provided in validator', () => {
    const formControl = getFormControlWithValue(10);
    const output = V.isAnyOf([0, 1, 2])(formControl);

    expect(output?.isAny).toBeTruthy();
  });
});
