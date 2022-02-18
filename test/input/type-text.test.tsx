import { createFormGroup, formGroup } from '../../src/lib';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    firstName: 'Thomas',
  });

  return (
    <>
      <p data-testid="value">{form().firstName}</p>
      <form use:formGroup={[form, setForm]}>
        <label htmlFor="firstName">First name</label>
        <input data-testid="input" id="firstName" type="text" formControlName="firstName" />
      </form>
      <button data-testid="btn" onClick={() => setForm((s) => ({ firstName: 'test' }))}>
        Change
      </button>
    </>
  );
};

describe('Input element of type="text" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const firstNameEl = await screen.findByTestId('value');
    const buttonEl = await screen.findByTestId('btn');

    expect(firstNameEl.innerHTML).toBe('Thomas');
  });

  it('should update form value when updating programmatically from outside the form', async () => {
    const firstNameEl = await screen.findByTestId('value');
    const buttonEl = await screen.findByTestId('btn');

    userEvent.click(buttonEl);

    expect(firstNameEl.innerHTML).toBe('test');
  });

  it('should update form value when on manual input', async () => {
    const firstNameEl = await screen.findByTestId('value');
    const inputEl = await screen.findByTestId('input');

    fireEvent.change(inputEl, { target: { value: '' } });
    userEvent.type(inputEl, 'test');

    expect(firstNameEl.innerHTML).toBe('test');
  });
});
