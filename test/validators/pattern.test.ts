import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';

// RegExp checks if string has "HH:mm:SS" pattern
const TEST_REG_EXP = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/gm;
const TEST_REG_EXP_STR = '^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$';

describe('"pattern" validator', () => {
  it('should return "null" if form control value matches the RegExp pattern', () => {
    const formControl = getFormControlWithValue('12:00:00');

    expect(V.pattern(TEST_REG_EXP)(formControl)).toBe(null);
  });

  it('should return "null" if form control value matches the string pattern', () => {
    const formControl = getFormControlWithValue('12:00:00');

    expect(V.pattern(TEST_REG_EXP_STR)(formControl)).toBe(null);
  });

  it('should return error if form control value matches the RegExp pattern', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.pattern(TEST_REG_EXP)(formControl);

    expect(output?.pattern).toBeTruthy();
  });

  it('should return error if form control value matches the string pattern', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.pattern(TEST_REG_EXP_STR)(formControl);

    expect(output?.pattern).toBeTruthy();
  });

  it('should return error if form control value is not "string" but "number"', () => {
    const formControl = getFormControlWithValue(Math.random());
    const output = V.pattern(TEST_REG_EXP)(formControl);

    expect(output?.pattern).toBeTruthy();
  });

  it('should return error if form control value is not "string" but "boolean"', () => {
    const formControl = getFormControlWithValue(Math.random() < 0.5);
    const output = V.pattern(TEST_REG_EXP)(formControl);

    expect(output?.pattern).toBeTruthy();
  });

  it('should return error if form control value is not "string" but "Date"', () => {
    const formControl = getFormControlWithValue(new Date());
    const output = V.pattern(TEST_REG_EXP)(formControl);

    expect(output?.pattern).toBeTruthy();
  });

  it('should return "null" if form control value is "null"', () => {
    const formControl = getFormControlWithValue(null);
    const output = V.pattern(TEST_REG_EXP)(formControl);

    expect(output).toBe(null);
  });
});
