import { createFormGroup, formGroup } from '../../src';
import { render } from 'solid-testing-library';
import { FormControlInvalidNestedGroupError } from '../../src/errors';

const TestApp = () => {
  const fg = createFormGroup({
    firstName: 'Thomas',
  });

  return (
    <>
      <form use:formGroup={fg}>
        <label for="firstName">First name</label>
        <input data-testid="input" id="firstName" type="text" formControlName="firstName" />

        <div formGroupName="address">
          <label for="city">City</label>
          <input data-testid="input" id="city" type="text" formControlName="city" />
        </div>
      </form>
    </>
  );
};

it('should throw an error when there is a nested form group defined in a template, but it is not defined in the form group value object', async () => {
  let error;
  try {
    render(() => <TestApp />);
  } catch (e) {
    error = e;
  }
  expect(error instanceof FormControlInvalidNestedGroupError).toBe(true);
});
