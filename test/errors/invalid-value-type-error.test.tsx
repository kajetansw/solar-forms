import { createFormGroup, formGroup } from '../../src';
import { render } from 'solid-testing-library';
import { FormControlInvalidTypeError } from '../../src/utils/errors';

const TestApp = () => {
  const fg = createFormGroup({
    firstName: 100,
  });

  return (
    <>
      <form use:formGroup={fg}>
        <label for="firstName">First name</label>
        <input data-testid="input" id="firstName" type="text" formControlName="firstName" />
      </form>
    </>
  );
};

it('should throw an error when type of the value passed to form does not match type of the form control', async () => {
  let error;
  try {
    render(() => <TestApp />);
  } catch (e) {
    error = e;
  }
  expect(error instanceof FormControlInvalidTypeError).toBe(true);
});
