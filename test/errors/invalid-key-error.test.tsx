import { createFormGroup, formGroup } from '../../src';
import { render } from 'solid-testing-library';
import { FormControlInvalidKeyError } from '../../src/utils/errors';

const FORM_GROUP_KEY = 'firstName';
const INVALID_FORM_GROUP_KEY = 'company';

const TestApp = () => {
  const fg = createFormGroup({
    [FORM_GROUP_KEY]: 'test',
  });

  return (
    <>
      <form use:formGroup={fg}>
        <label for="firstName">First name</label>
        <input data-testid="input" id="firstName" type="text" formControlName={INVALID_FORM_GROUP_KEY} />
      </form>
    </>
  );
};

it('should throw an error when formControlName does not match the initial form value', async () => {
  let error;
  try {
    render(() => <TestApp />);
  } catch (e) {
    error = e;
  }
  expect(error instanceof FormControlInvalidKeyError).toBe(true);
});
