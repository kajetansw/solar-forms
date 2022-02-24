import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 'product';
const OTHER_VALID_INPUT_VALUES = ['design', 'testing', 'engineering'];
const getRandomTeam = () =>
  OTHER_VALID_INPUT_VALUES[Math.floor(Math.random() * OTHER_VALID_INPUT_VALUES.length)];

let randomTeam = 'product';

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    team: 'product',
  });

  return (
    <>
      <p data-testid="value">{form().team}</p>
      <form use:formGroup={[form, setForm]}>
        <input type="radio" id="radio-engineering" name="team" value="engineering" formControlName="team" />
        <label htmlFor="radio-engineering">engineering</label>
        <input type="radio" id="radio-product" name="team" value="product" formControlName="team" />
        <label htmlFor="radio-product">product</label>
        <input type="radio" id="radio-testing" name="team" value="testing" formControlName="team" />
        <label htmlFor="radio-testing">testing</label>
        <input type="radio" id="radio-design" name="team" value="design" formControlName="team" />
        <label htmlFor="radio-design">design</label>
      </form>
      <button data-testid="btn" onClick={() => setForm({ team: randomTeam })}>
        Update
      </button>
    </>
  );
};

describe('Input element with type="radio" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
    randomTeam = getRandomTeam();
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const $value = await screen.findByTestId('value');

    expect($value.innerHTML).toBe(INIT_INPUT_VALUE);
  });

  it('should update form value when updating programmatically from outside the form', async () => {
    const $value = await screen.findByTestId('value');
    const $button = await screen.findByTestId('btn');

    userEvent.click($button);

    expect($value.innerHTML).toBe(randomTeam);
  });

  it('should update form value when on manual input', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.getByLabelText(randomTeam);

    userEvent.click($input);

    expect($value.innerHTML).toBe(randomTeam);
  });
});
