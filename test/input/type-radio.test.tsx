import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 'product';
const OTHER_VALID_INPUT_VALUES = ['design', 'testing', 'engineering'];
const getRandomTeam = () =>
  OTHER_VALID_INPUT_VALUES[Math.floor(Math.random() * OTHER_VALID_INPUT_VALUES.length)];
const NULL = String(null);

let randomTeam = 'product';

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    team: 'product' as string | null,
  });

  return (
    <>
      <p data-testid="value">{form().team}</p>
      <form use:formGroup={[form, setForm]}>
        <input type="radio" id="radio-engineering" name="team" value="engineering" formControlName="team" />
        <label for="radio-engineering">engineering</label>
        <input type="radio" id="radio-product" name="team" value="product" formControlName="team" />
        <label for="radio-product">product</label>
        <input type="radio" id="radio-testing" name="team" value="testing" formControlName="team" />
        <label for="radio-testing">testing</label>
        <input type="radio" id="radio-design" name="team" value="design" formControlName="team" />
        <label for="radio-design">design</label>
      </form>
      <button data-testid="btn" onClick={() => setForm({ team: randomTeam })}>
        Update
      </button>
      <button data-testid="btn-null" onClick={() => setForm({ team: null })}>
        Update to null
      </button>
    </>
  );
};

describe('Input element with type="radio" as form control', () => {
  let $value: HTMLElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNullButton: HTMLElement;
  let $input: HTMLInputElement;

  beforeEach(async () => {
    render(() => <TestApp />);
    randomTeam = getRandomTeam();

    $value = await screen.findByTestId('value');
    $changeToStringButton = await screen.findByTestId('btn');
    $changeToNullButton = await screen.findByTestId('btn-null');
    $input = (await screen.getByLabelText(randomTeam)) as HTMLInputElement;
  });

  it('should init value with the one provided in createFormGroup', async () => {
    expect($value.innerHTML).toBe(INIT_INPUT_VALUE);
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with string', async () => {
      userEvent.click($changeToStringButton);

      expect($value.innerHTML).toBe(randomTeam);
    });

    it('with null', async () => {
      userEvent.click($changeToNullButton);

      expect($value.innerHTML === NULL || $value.innerHTML === '').toBeTruthy();
    });
  });

  it('should update form value when on manual input', async () => {
    userEvent.click($input);

    expect($value.innerHTML).toBe(randomTeam);
  });
});
