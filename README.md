<div align="center">
  <img src="docs/logo.svg" align="center"/>
</div> 

<h2 align="center">Solar Forms</h2>

<p align="center">
  Forms library for <a href="https://www.solidjs.com/">SolidJS</a>
  inspired by <a href="https://angular.io/">Angular</a>'s reactive forms.
</p> 

<p align="center">
  <a href="https://www.npmjs.com/package/solar-forms">
    <img src="https://img.shields.io/npm/v/solar-forms.svg" alt="npm version" height="18">
  </a>
  <a href="https://www.npmjs.com/package/solar-forms">
    <img src="https://img.shields.io/npm/dm/solar-forms.svg" alt="downloads" height="18">
  </a>
  <a href="https://github.com/kajetansw/solar-forms">
    <img src="https://img.shields.io/npm/l/solar-forms.svg" alt="MIT license" height="18">
  </a>
</p>

```tsx
import { createFormGroup, formGroup } from 'solar-forms';
import { Show } from 'solid-js';

const Registration = ({ onSubmit }: Props) => {
  const fg = createFormGroup({
    email: ['', { validators: [required] }],
    name: '',
    password: ['', { validators: [required] }],
    acceptTerms: [false, { validators: [isTrue] }]
  });
  const [form, setForm] = fg.value;
  const validAll = fg.validAll;

  return (
    <>
      <form use:formGroup={fg}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" formControlName="email" />
        
        <label htmlFor="name">Name (optional)</label>
        <input id="name" type="text" formControlName="name" />
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" formControlName="password" />
        
        <label htmlFor="acceptTerms">Accept terms</label>
        <input id="acceptTerms" type="checkbox" formControlName="acceptTerms" />
        
        <button type="submit" disabled={!validAll()} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </>
  );
};
```


## About

Solar Forms allows you to create **reactive and type-safe** state for your form controls. It lets you take over 
form controls and **access key information** like control's current value, whether it's disabled, valid, etc. 
as SolidJS signals. Form controls can also be pre-configured with validator functions, ensuring your 
form won't be marked as valid unless **all data is correct**.

> ### ⚠️ This library is still in very early stages of development. It is not encouraged to use it in production applications. Although we encourage you to try it out and give some feedback!

## Features

- Create form group as a set of related controls that you can manage.
- Use form control properties like `value`, `disabled`, `dirty` and `touched`.
- Use form group properties like `disabledAll`, `dirtyAll` and `touchedAll`.
- Pre-configure form controls with build-in or custom validator functions to ensure you have all information you need before the form is submitted.
- Check if a single form control or an entire form group is valid with `valid` and `validAll` properties.
- Access validation errors with `errors` form control property.
- Access all form group and form control properties as SolidJS signals.
- Create nested form control structures.


## Installation

```shell
# using npm
npm install solar-forms

# using yarn
yarn add solar-forms
```

Before you start, register the directive and new attributes for HTML elements 
by [extending SolidJS's JSX namespace](https://www.solidjs.com/docs/latest/api#use%3A___):

```tsx
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      formGroup?: {};
    }

    interface InputHTMLAttributes<T> {
      formControlName?: string;
    }

    interface HTMLAttributes<T> {
      formGroupName?: string;
    }
  }
}
```

This will allow you to bind Solar's form group to your form elements without TypeScript type errors 
related to new HTML attributes.


# Documentation

- [Online examples](#online-examples)
- [Getting started](#getting-started)
  * [Creating form group](#creating-form-group)
  * [Binding our form group to the `form` element using `formGroup` directive](#binding-our-form-group-to-the-form-element-using-formgroup-directive)
  * [Accessing form control values at any time](#accessing-form-control-values-at-any-time)
  * [Managing `disabled` form control property](#managing-disabled-form-control-property)
  * [Managing `disabledAll` form group property](#managing-disabledall-form-group-property)
  * [Managing `dirty` form control property](#managing-dirty-form-control-property)
  * [Managing `dirtyAll` form group property](#managing-dirtyall-form-group-property)
  * [Managing `touched` form control property](#managing-touched-form-control-property)
  * [Managing `touchedAll` form group property](#managing-touchedall-form-group-property)
  * [Validating form controls](#validating-form-controls)
    + [Setting up form control validators](#setting-up-form-control-validators)
    + [Accessing the `valid` form control property](#accessing-the-valid-form-control-property)
    + [Accessing the `validAll` form group property](#accessing-the-validall-form-group-property)
    + [Accessing validation errors](#accessing-validation-errors)
  * [Binding form controls to different types of input elements](#binding-form-controls-to-different-types-of-input-elements)
    + [Type of "text"](#type-of-text)
    + [Type of "email"](#type-of-email)
    + [Type of "password"](#type-of-password)
    + [Type of "tel"](#type-of-tel)
    + [Type of "url"](#type-of--url-)
    + [Type of "number"](#type-of-number)
    + [Type of "range"](#type-of-range)
    + [Type of "date"](#type-of-date)
    + [Type of "datetime-local"](#type-of-datetime-local)
    + [Type of "time"](#type-of-time)
    + [Type of "checkbox"](#type-of-checkbox)
    + [Type of "radio"](#type-of-radio)
  * [Form control errors](#form-control-errors)
    + [Form control name does not match any key from form group](#form-control-name-does-not-match-any-key-from-form-group)
    + [Form control type does not match the type of an input element](#form-control-type-does-not-match-the-type-of-an-input-element)
  * [Nested form groups](#nested-form-groups)
- [Roadmap](#roadmap)
- [Support](#support)
- [Contribution guidelines](#contribution-guidelines)
- [Inspirations](#inspirations)

## Online examples

🚧 Under construction! 🚧

## Getting started

### Creating form group

One of main elements of Solar Forms is `createFormGroup` function, that lets you
instantiate form group that you can use to manage your form:

```tsx
const fg = createFormGroup({
  // ➡️ Registering form control under `firstName` name 
  firstName: 'John',
});
```

`createFormGroup` has a single argument and that is an object representing structure
of your form. In the case above we define the `firstName` form control and we set
an initial value to it.

Later you'll see just how much we can expand your form group and which properties
of it we'll be able to manage!


### Binding our form group to the `form` element using `formGroup` directive

Second of the main concepts of Solar Forms is the `formGroup` [SolidJS directive](https://www.solidjs.com/tutorial/bindings_directives), 
that allows you to bind your form group to your `form` HTML element:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Form control named `firstName`
  firstName: 'John',
});

// 2️⃣ Binding form group to the form using `use:formGroup`
return (
  <form use:formGroup={fg}>
    <label htmlFor="firstName">First name</label>
    {/* 3️⃣ Binding form control to the input element using `formControlName` property */}
    <input id="firstName" type="text" formControlName="firstName" />
  </form>
);
```

Under the hood, the `formGroup` directive sets up the entire set of [SolidJS signals](https://www.solidjs.com/tutorial/introduction_signals)
and initiates form control properties.

Still, our form group needs to know which form controls belong to which form inputs.
This is why we bind those together by assigning `formGroupName` property to form inputs
with the same name, as defined for the form control.


### Accessing form control values at any time

After you set up your form group the way shown above, you can access your form control
values using the `value` signal:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'John',
});
// ➡️ Accessing form group `value` signal
const [form, setForm] = fg.value;

return (
  <form use:formGroup={fg}>
    <label htmlFor="firstName">First name</label>
    <input id="firstName" type="text" formControlName="firstName" />
  </form>
);
```

The `value` signal contains tuple of reactive value for our form group and a setter
function. You'll see this pattern along the way of learning about the rest of form control properties:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'John',
});
const [form, setForm] = fg.value;

// 1️⃣ Accessing form groups's reactive value
const logForm = () => console.log(JSON.stringify(form()));

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" type="text" formControlName="firstName" />
    </form>

    {/* 2️⃣ Clicking this logs "{"firstName":"John"}" */}
    <button onClick={logForm}>
      Log form value
    </button>
  </>
);
```

A setter function allows us to set the form controls' values at will:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'John',
});
const [form, setForm] = fg.value;

// ➡️ Changing form control value
const changeName = () => setForm({ ...form(), firstName: 'Tom' });

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" type="text" formControlName="firstName" />
    </form>

    <button onClick={changeName}>
      Change first name
    </button>
  </>
);
```

As an argument, setter functions for form controls accept new form group value object, 
or a setter callback:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
const [form, setForm] = fg.value;

// 1️⃣ Update form value by passing value object
const changeName1 = () => setForm({ ...form(), firstName: 'Tom' });
// 2️⃣ Update form value by passing setter callback
const changeName2 = () => setForm(f => ({ ...f, firstName: 'Tom' }));
```


### Managing `disabled` form control property

When defining your form group, you can mark individual form controls as disabled by default.
You can do that by passing a tuple of default value and form control config, instead of 
a single value:

```tsx
const fg = createFormGroup({
  // With this, the `firstName` form control is marked as disabled by default
  firstName: ['John', { disabled: true }],
});
```

As you may have already realised, if you do not implicitly mark control as disabled, only by passing
only a default value, the form control is enabled by default:

```tsx
const fg = createFormGroup({
  // The `firstName` form control is set as enabled by default
  firstName: 'John',
});
```

You can access the `disabled` state of the form controls by using a specific form group signal:

```tsx
const fg = createFormGroup({
  firstName: ['John', { disabled: true }],
});
// Accessing the reactive enabled/disabled state of form controls 
// and a setter function under `disabled` property
const [disabled, setDisabled] = fg.disabled;
```

Under the hood, the `disabled` state is bound to your form elements, so that any change to form
control state is reflected in the UI:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: ['John', { disabled: true }],
});
const [disabled, setDisabled] = fg.disabled;

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      {/* ➡️ This form element is now disabled */}
      <input id="firstName" type="text" formControlName="firstName" />
    </form>
  </>
);
```

Also, any update to the `disabled` form control state is reflected in the UI as well:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: ['John', { disabled: true }],
});
const [disabled, setDisabled] = fg.disabled;

const enableFirstName = () => setDisabled(d => ({ ...d, firstName: false }));

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      {/* 1️⃣ This form element is disabled on initialization */}
      <input id="firstName" type="text" formControlName="firstName" />
    </form>

    {/* 2️⃣ After clicking this button, the `firstName` form input becomes enabled */}
    <button onClick={enableFirstName}>
      Enable first name
    </button>
  </>
);
```


### Managing `disabledAll` form group property

If you value information on whether your entire form is disabled (meaning, every form input
element is disabled), you can use the `disabledAll` form group property, which also is
a SolidJS signal:

```tsx
const fg = createFormGroup({
  firstName: ['John', { disabled: true }],
  lastName: 'Smith',
});
// Accessing information on whether the entire form is disabled or enabled
const [disabledAll, setDisabledAll] = fg.disabledAll;
```

This aggregates all `disabled` form control properties under one `boolean` value:

```tsx
const fg = createFormGroup({
  firstName: ['John', { disabled: true }],
  lastName: 'Smith',
});
const [disabledAll, setDisabledAll] = fg.disabledAll;

// Logs `false`, because the `lastName` form control is enabled
console.log(disabledAll());
```

You can also set your entire form as enabled or disabled using the `setDisabledAll` setter function:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: ['John', { disabled: true }],
  lastName: 'Smith',
});
const [disabledAll, setDisabledAll] = fg.disabledAll;

// 1️⃣ Set all form elements as disabled with this single call
const disableForm = () => setDisabledAll(true);

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" type="text" formControlName="firstName" />
      <label htmlFor="lastName">Last name</label>
      <input id="lastName" type="text" formControlName="lastName" />
    </form>

    {/* 2️⃣ After clicking this button, all form elements become disabled */}
    <button onClick={disableForm}>
      Disable form
    </button>
  </>
);
```

> ⚠️ As a contrary to `value` or `disabled` **form control properties**, `disabledAll` is a **form group property**,
as it represents state of the entire form, not its individual elements.

As an argument, the setter function for `disabledAll` property accepts boolean or a setter callback:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
const [disabledAll, setDisabledAll] = fg.disabledAll;

// 1️⃣ Update `disabledAll` state by passing boolean
const disableForm1 = () => setDisabledAll(true);
// 2️⃣ Update `disabledAll` state by passing setter callback
const disableForm2 = () => setDisabledAll(d => !d);
```


### Managing `dirty` form control property

After you define your form group, it tracks whether the user has already
changed the form input value from UI. That's what the `dirty` form control property is for:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
// Accessing the reactive `dirty` state of form controls 
// and a setter function under the `dirty` signal
const [dirty, setDirty] = fg.dirty;
```

Under the hood, every form control is marked as "pristine" (as an opposite to "dirty") on initialization , 
so all `dirty` values for form controls are `false` by default:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
const [dirty, setDirty] = fg.dirty;

// 1️⃣ Logs `false`, as user did not update the form input yet
console.log(dirty().firstName);
```

Whenever the user changes the form input value from UI, the `dirty` property for the form control
is set to `true`:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: '',
});
const [dirty, setDirty] = fg.dirty;

const logDirtyForFirstName = () => console.log(dirty().firstName);

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      {/* 1️⃣ Imagine user updating their first name from UI */}
      <input id="firstName" type="text" formControlName="firstName" />
    </form>

    {/* 2️⃣ After the update, clicking this button logs `true` */}
    <button onClick={logDirtyForFirstName}>
      Log
    </button>
  </>
);
```

You can also mark your form controls as "dirty" or "pristine" (as an opposite to "dirty") 
programmatically as well:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: '',
});
const [dirty, setDirty] = fg.dirty;

const changeDirtyForFirstName = () => setDirty(d => ({ ...d, firstName: false }));
const logDirtyForFirstName = () => console.log(dirty().firstName);

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      {/* 1️⃣ Imagine user updates their first name from UI */}
      <input id="firstName" type="text" formControlName="firstName" />
    </form>

    {/* 2️⃣ After the update, clicking this button marks the `firstName` */}
    {/* form control as "dirty" again */}
    <button onClick={changeDirtyForFirstName}>
      Change dirty
    </button>
    {/* 3️⃣ Clicking this button logs `false`, as we set the property to it ourselves */}
    <button onClick={logDirtyForFirstName}>
      Log
    </button>
  </>
);
```

### Managing `dirtyAll` form group property

Similarly to `disabledAll`, there is a `dirtyAll` form group property aggregating all form controls'
`dirty` properties under one `boolean` value. `dirtyAll` holds information whether the entire form
(meaning every form control in the form) is "dirty":

```tsx
const fg = createFormGroup({
  firstName: 'John',
  lastName: 'Smith',
});
// 1️⃣ Accessing information on whether the entire form is dirty
const [dirtyAll, setDirtyAll] = fg.dirtyAll;

// 2️⃣ Logs `false`, because all form controls weren't updated from UI
console.log(dirtyAll());
```

You can also set your entire form as "dirty" or "pristine" (as an opposite to "dirty")
using the `setDirtyAll` setter function:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'Johm',
  lastName: 'Smith',
});
const [dirtyAll, setDirtyAll] = fg.dirtyAll;

// 1️⃣ Sets all form elements as "dirty" with a single call
const changeAllToDirty = () => setDirtyAll(true);
const logDirtyAll = () => console.log(dirtyAll());

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" type="text" formControlName="firstName" />
      <label htmlFor="lastName">Last name</label>
      <input id="lastName" type="text" formControlName="lastName" />
    </form>

    {/* 2️⃣ After clicking this button, all form elements are marked as "dirty" */}
    <button onClick={changeAllToDirty}>
      Change all to dirty
    </button>

    {/* 3️⃣ After the update, clicking this button logs `true` */}
    <button onClick={logDirtyAll}>
      Log dirtyAll
    </button>
  </>
);
```

As an argument, the setter function for `dirtyAll` property accepts `boolean` or a setter callback:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
const [dirtyAll, setDirtyAll] = fg.dirtyAll;

// 1️⃣ Update `dirtyAll` state by passing boolean
const markAllAsDirty1 = () => setDirtyAll(true);
// 2️⃣ Update `dirtyAll` state by passing setter callback
const markAllAsDirty2 = () => setDirtyAll(d => !d);
```


### Managing `touched` form control property

After you define your form group, it tracks whether the user has already
triggered a [blur event](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) 
on the form input value. With this you can track whether the user has already been focused on
a specific form input element, or not. That's what the `touched` form control property is for:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
// 1️⃣ Accessing the reactive "touched" state of form controls 
// and a setter function under the `touched` signal
const [touched, setTouched] = fg.touched;
```

Under the hood, every form control is marked as "untouched" on initialization, so
all `touched` values for form controls are `false` by default:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
const [touched, setTouched] = fg.touched;

// 1️⃣ Logs `false`, as there hasn't been a "blur" event triggered yet on the `firstName` form input 
console.log(touched().firstName);
```

Whenever user switches from the specific form control to another (triggering the "blur" event), 
the `touched` property for the form control is set to `true`:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'John',
  lastName: 'John',
});
const [touched, setTouched] = fg.touched;

const logTouchedForFirstName = () => console.log(touched().firstName);

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      {/* 1️⃣ Imagine user switching from this form input... */}
      <input id="firstName" type="text" formControlName="firstName" />
      <label htmlFor="lastName">Last name</label>
      {/* 2️⃣ ... to this one */}
      <input id="lastName" type="text" formControlName="lastName" />
    </form>

    {/* 3️⃣ After the "blur" event has been triggered, clicking this button logs `true` */}
    <button onClick={logTouchedForFirstName}>
      Log
    </button>
  </>
);
```

You can also mark your form controls as "touched" or "untouched" programmatically:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'John',
  lastName: 'John',
});
const [touched, setTouched] = fg.touched;

const changeTouchedForFirstName = () => setTouched(d => ({ ...d, firstName: false }));
const logTouchedForFirstName = () => console.log(touched().firstName);

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      {/* 1️⃣ Imagine user switching from this form input... */}
      <input id="firstName" type="text" formControlName="firstName" />
      <label htmlFor="lastName">Last name</label>
      {/* 2️⃣ ... to this one */}
      <input id="lastName" type="text" formControlName="lastName" />
    </form>

    {/* 3️⃣ After the "blur" event has been triggered, clicking this */}
    {/* switches `touched` to `false` again */}
    <button onClick={changeTouchedForFirstName}>
      Change touched
    </button>
    {/* 4️⃣ Clicking this button logs `false`, as we set the property to it ourselves */}
    <button onClick={logTouchedForFirstName}>
      Log
    </button>
  </>
);
```


### Managing `touchedAll` form group property

Similarly to `disabledAll` and `dirtyAll`, there is a `touchedAll` form group property aggregating 
all form controls' `touched` properties under one `boolean` value. `touchedAll` holds information 
whether the entire form (meaning every form control in the form) is "touched":

```tsx
const fg = createFormGroup({
  firstName: 'Johm',
  lastName: 'Smith',
});
// 1️⃣ Accessing information on whether the entire form is "touched"
const [touchedAll, setTouchedAll] = fg.touchedAll;

// 2️⃣ Logs `false`, because "blur" event wasn't triggered for all form inputs
console.log(touchedAll());
```

You can also mark your entire form as "touched" or "untouched" using the `setTouchedAll` setter 
function:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'Johm',
  lastName: 'Smith',
});
const [touchedAll, setTouchedAll] = fg.touchedAll;

// 1️⃣ Sets all form elements as "touched" with a single call
const changeAllToTouched = () => setTouchedAll(true);
const logTouchedAll = () => console.log(touchedAll());

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="firstName">First name</label>
      <input id="firstName" type="text" formControlName="firstName" />
      <label htmlFor="lastName">Last name</label>
      <input id="lastName" type="text" formControlName="lastName" />
    </form>

    {/* 2️⃣ After clicking this button, all form elements are marked as "touched" */}
    <button onClick={changeAllToTouched}>
      Change all to touched
    </button>

    {/* 3️⃣ After the update, clicking this button logs `true` */}
    <button onClick={logTouchedAll}>
      Log touchedAll
    </button>
  </>
);
```

As an argument, the setter function for `touchedAll` property accepts `boolean` or a setter callback:

```tsx
const fg = createFormGroup({
  firstName: 'John',
});
const [touchedAll, setTouchedAll] = fg.touchedAll;

// 1️⃣ Update `touchedAll` state by passing boolean
const markAllAsDirty1 = () => setTouchedAll(true);
// 2️⃣ Update `touchedAll` state by passing setter callback
const markAllAsDirty2 = () => setTouchedAll(d => !d);
```


### Validating form controls

#### Setting up form control validators

As you've probably worked with forms before (as a developer or a user), you realised that not every 
user input should be valid. We do not accept emails with wrong format, empty passwords, terms checkbox
not ticked or dates of birth that make you over 200 years old.

With Solar Forms you can take control over your user's input and define how your form controls
should be validated. You can do that by using build-in or custom validator functions:

```tsx
import { FormControl, ValidatorFn } from 'solar-forms';

const required: ValidatorFn = (formControl: FormControl) => 
  formControl.value ? null : { required: 'This is required!' };
```

This is a very simple example of how to define custom `required` validator function for your
form controls. Here we are checking whether the value is falsy (but remember that `0` is also falsy!)
and if it is, we return the record with validation error message(s). If the value is valid, we return
`null`, meaning there are no validation errors.

`FormControl` and `ValidatorFn` types seem important here, so let's take a look at their definitions:

```tsx
export interface FormControl {
  value: string | number | boolean | Date | null;
  disabled: boolean;
  touched: boolean;
  dirty: boolean;
}

export interface ValidatorFn {
  (control: FormControl): ValidationErrors | null;
}

export type ValidationErrors = {
  [key: string]: unknown;
};
```

As you can see, when defining a validator function, you can use various data about your
form control that may be important to you: its current value and whether it is disabled, touched or dirty.

With validator function defined, you can pre-configure your form controls with it when creating 
your form group:

```tsx
const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  // Adding validator(s) to your form control
  password: ['', { validators: [required] }],
});
```

As you see, you can add validator(s) to your form control by passing a list of validator functions 
to the config object under the `validators` key.


#### Accessing the `valid` form control property

After you define your form group, it tracks whether the form control values are valid or invalid.
That's what the `valid` form control property is for:

```tsx
const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  password: ['', { validators: [required] }],
});
// Accessing the reactive "valid" state of form controls 
const valid = fg.valid;
```

Under the hood, every form control is marked as valid or invalid on initialization, based on
whether the form control value passes the all validator functions. 

```tsx
const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  password: ['', { validators: [required] }],
});
const valid = fg.valid;

// Logs `false` as the value is required and it's an empty string on initialization
console.log(valid().password);
```

After changing form control values, (either with UI or using value setter functions), the validation 
functions are run again against form control values and the `valid` state is updated accordingly.

```tsx
// Inside a component

const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  password: ['', { validators: [required] }],
});
const valid = fg.valid;

const logValidForPassword = () => console.log(valid().password);

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="password">Password</label>
      {/* 1️⃣ Imagine user typing their password */}
      <input id="password" type="password" formControlName="password" />
    </form>

    {/* 2️⃣ After user types their password, clicking this button logs `true` */}
    <button onClick={logValidForPassword}>
      Log
    </button>
  </>
);
```


#### Accessing the `validAll` form group property

`valid` form control property also has the corresponding form group property - `validAll`.
It represents aggregated data on all form controls being valid or not. That means you 
can use `validAll` accessor to check whether the whole form is valid or not:

```tsx
const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  name: '',
  password: ['', { validators: [required] }],
});
// 1️⃣ Accessing the reactive "validAll" state of form controls 
const validAll = fg.validAll;

// 2️⃣ Logs `false` as one of form control values is required and it's 
// an empty string on initialization
console.log(validAll());
```

When all form controls are valid (all form controls' validator functions pass), `validAll` returns
`true` as well:

```tsx
// Inside a component

const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  name: '',
  password: ['', { validators: [required] }],
});
const validAll = fg.validAll;

const logValidAll = () => console.log(validAll());

return (
  <>
    <form use:formGroup={fg}>
      <label htmlFor="name">Name (optional)</label>
      <input id="name" type="text" formControlName="name" />
      <label htmlFor="password">Password</label>
      {/* 1️⃣ Imagine user typing their password */}
      <input id="password" type="password" formControlName="password" />
    </form>

    {/* 2️⃣ After user types their password, clicking this button logs `true` */}
    <button onClick={logValidAll}>
      Log
    </button>
  </>
);
```


#### Accessing validation errors

At the same time, form group tracks all validation errors at a given time with the `errors`
form control property:

```tsx
const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  password: ['', { validators: [required] }],
});
// Accessing the reactive "errors" state of form controls 
const errors = fg.errors;
```

On initialization and on every form value update validator functions are run against form control
values and the `errors` form control property is updated accordingly:

```tsx
const required = (formControl) =>
  formControl.value ? null : { required: 'This is required!' };

const fg = createFormGroup({
  name: '',
  password: ['', { validators: [required] }],
});
const errors = fg.errors;

// 1️⃣ Logs "{"required":"This is required!"}" as the value is required 
// and it's an empty string on initialization
console.log(JSON.stringify(errors().password));

// 2️⃣ Logs "null" as the value has no validators, so it's valid by default 
console.log(JSON.stringify(errors().name));
```

`error` form control property holds an object with all validation errors aggregated under one
object.

> ⚠️ Because of the fact, that `error` form control property holds an object with all validation 
> errors aggregated under one record, it is advised to name keys for your validation errors object in 
> a unique way when creating your custom validator functions.
> 
> Doing otherwise may result in overwriting your keys inside the `ValidationErrors` record.  



### Binding form controls to different types of input elements

There are [a lot of possible types for an HTML input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
and Solar Forms allows you to work with HTML input elements of every major type:

- text
- email
- password
- tel
- url
- number
- range
- date
- datetime-local
- time
- checkbox
- radio


#### Type of `text`

This is the most basic input element - a string-based input element type. Accordingly, you can
define your form control's default value as `string` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here as string
  name: '',
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="name">Name</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="name" type="text" formControlName="name" />
  </form>
);
```

#### Type of `email`

Another string-based input element type. For the corresponding form control you can
define the default value as `string` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here as string
  email: '',
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="email">Email</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="email" type="email" formControlName="email" />
  </form>
);
```

#### Type of `password`

Another string-based input element type. For the corresponding form control you can
define the default value as `string` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here as string
  password: '',
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="password">Password</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="password" type="password" formControlName="password" />
  </form>
);
```

#### Type of `tel`

Another string-based input element type. For the corresponding form control you can
define the default value as `string` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here as string
  tel: '',
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="tel">Tel</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="tel" type="tel" formControlName="tel" />
  </form>
);
```

#### Type of `url`

Another string-based input element type. For the corresponding form control you can
define the default value as `string` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here as string
  url: '',
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="url">URL</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="url" type="url" formControlName="url" />
  </form>
);
```

#### Type of `number`

The most basic number-based type of input element. In this case, for the corresponding form control 
you can define the default value as `number` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here as number
  age: 0,
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="age">URL</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="age" type="number" formControlName="age" />
  </form>
);
```

#### Type of `range`

Another number-based type of input element. For the corresponding form control 
you can define the default value as `number` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here as number
  skillLevel: 0,
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="skillLevel">Skill level</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="skillLevel" type="range" formControlName="skillLevel" />
  </form>
);
```

#### Type of `date`

A date-based type of input element. In this case, for the corresponding form control
you can define the default value as `Date` object, `string`, `number` or `null`:

> ⚠️ If you wish to bind string values to the `date` form control, remember about using
> [proper date text formats](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#format_of_a_valid_date_string).

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default values are set here
  dateDate: new Date(),
  dateString: new Date().toISOString().split('T')[0],
  dateNumber: new Date().getTime(),
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="dateDate">Date [Date]</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="dateDate" type="date" formControlName="dateDate" />
    
    <label htmlFor="dateString">Date [string]</label>
    <input id="dateString" type="date" formControlName="dateString" />
    
    <label htmlFor="dateNumber">Date [number]</label>
    <input id="dateNumber" type="date" formControlName="dateNumber" />
  </form>
);
```

#### Type of `datetime-local`

A date-based type of input element. In this case, for the corresponding form control
you can define the default value as `string`, `number` or `null`:

> ⚠️ If you wish to bind `string` values to the `datetime-local` form control, remember about using
> [proper date text formats](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#format_of_a_valid_date_string).

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default values are set here
  dateString: new Date().toISOString().split('.')[0],
  dateNumber: new Date().getTime(),
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="dateString">Date [string]</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="dateString" type="datetime-local" formControlName="dateString" />
    
    <label htmlFor="dateNumber">Date [number]</label>
    <input id="dateNumber" type="datetime-local" formControlName="dateNumber" />
  </form>
);
```

#### Type of `time`

A time-based type of input element. In this case, for the corresponding form control
you can define the default value as `Date`, `string`, `number` or `null`:

> ⚠️ If you wish to bind `string` values to the `time` form control, remember about using
> [proper time text formats](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#time_strings).

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default values are set here
  timeDate: new Date(),
  timeString: '00:00:00',
  timeNumber: new Date().getTime(),
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="timeDate">Date [Date]</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="timeDate" type="time" formControlName="timeDate" />
    
    <label htmlFor="timeString">Date [string]</label>
    <input id="timeString" type="time" formControlName="timeString" />
    
    <label htmlFor="timeNumber">Date [number]</label>
    <input id="timeNumber" type="time" formControlName="timeNumber" />
  </form>
);
```

#### Type of `checkbox`

A boolean-based type of input element. For the corresponding form control
you can define the default value as `boolean` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default values are set here
  acceptTerms: false,
});

return (
  <form use:formGroup={fg}>
    <label htmlFor="acceptTerms">Date [Date]</label>
    {/* 2️⃣ Here we define the `type` attribute of the input element */}
    <input id="acceptTerms" type="checkbox" formControlName="acceptTerms" />
  </form>
);
```

#### Type of `radio`

A string-based type of input element, where you can choose one of pre-defined set of options. 
For the corresponding form control you can define the default value as `string` or `null`:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Default value is set here
  // 2️⃣ Imagine you can have 3 options here: "engineering", "testing" and "product"
  team: null,
});

return (
  <form use:formGroup={fg}>
    {/* 3️⃣ Choosing one of 3 options sets form control value to */}
    {/* a value assigned to specific radio input */}
    <input type="radio" id="radioEngineering" name="team" value="engineering" formControlName="team" />
    <label htmlFor="radioEngineering">Engineering</label>
    <input type="radio" id="radioProduct" name="team" value="product" formControlName="team" />
    <label htmlFor="radioProduct">Product</label>
    <input type="radio" id="radioTesting" name="team" value="testing" formControlName="team" />
    <label htmlFor="radioTesting">Testing</label>
  </form>
);
```

### Form control errors

To ensure that the form group defined by us matches the form structure in our template, some
additional runtime checks were implemented.

#### Form control name does not match any key from form group

In case we'd made a mistake while connecting a form group key with the form input element using 
`formControlName` HTML attribute, we would get a runtime error informing us of the mistake:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'John',
});

return (
  <>
    <form use:formGroup={fg}>
      <label for="firstName">First name</label>
      <input id="firstName" type="text" formControlName="company" />
    </form>
  </>
);
```

This one results in throwing a custom `FormControlInvalidKeyError` error with a message:
```
"company" form control name does not match any key from the form group.
```

#### Form control type does not match the type of an input element 

In case we'd made a mistake when initializing the value of a form control in our form group, that
wasn't supposed to be used with a given HTML element, we would get a runtime error informing 
us of the mistake:

```tsx
// Inside a component

const fg = createFormGroup({
  // 1️⃣ Here we initialize `firstName` form control value as `string`
  firstName: 'John',
});

return (
  <>
    <form use:formGroup={fg}>
      <label for="firstName">First name</label>
      {/* 2️⃣ But here we use input element with type "number" - types mismatch */}
      <input id="firstName" type="number" formControlName="firstName" />
    </form>
  </>
);
```

This one results in throwing a custom `FormControlInvalidTypeError` error with a message:
```
Value of the "firstName" form control is expected to be of type [number] but the type was [string].
```

### Nested form groups

You can define nested form groups, by placing a nested record in your form group schema:

```tsx
const fg = createFormGroup({
  firstName: 'John',
  // Here we create a nested form group
  address: {
    city: '',
    postalNumber: null
  }
});
```

This makes composing complex form models easier to maintain and logically group together.

When building complex forms, managing the different areas of information is easier in smaller 
sections. Using nested form groups lets you break large forms groups into smaller, 
more manageable ones, e.g. for styling or domain purposes.

To represent nested form groups in your template, you must wrap the form input elements
for that nested form group in another element, e.g. `div` and declare a `formGroupName` attribute:

```tsx
// Inside a component

const fg = createFormGroup({
  firstName: 'John',
  address: {
    city: '',
    postalNumber: null
  }
});

return (
  <>
    <form use:formGroup={fg}>
      <label for="firstName">First name</label>
      <input id="firstName" type="text" formControlName="firstName" />
      
      <div formGroupName="address">
        <label for="city">City</label>
        <input id="city" type="text" formControlName="city" />
        
        <label for="postalNumber">Postal number</label>
        <input id="postalNumber" type="number" formControlName="postalNumber" />
      </div>
    </form>
  </>
);
```

All rules and features apply to the nested form groups as well:
- accessing the `value`, `disabled`, `dirty`, `touched`, `valid` and `errors` signals
- pre-configuring nested form control with `disabled` and `validators`
- using proper HTML input elements with proper form control types
- runtime type checking for proper using of form group keys and values


## Roadmap

- [ ] Creating and exporting [build-in validator functions](https://angular.io/api/forms/Validators) for common usage
- [ ] Support for `<textarea>` element
- [ ] Support for `<select>` element
- [ ] Defining and using [form arrays](https://angular.io/guide/reactive-forms#creating-dynamic-forms)
- [ ] Support for [async validators](https://angular.io/api/forms/AsyncValidatorFn)


## Support

If you want to say thank you and/or support development of Solar Forms:

1. Add a GitHub Star to the project.
2. Tweet about the project on your Twitter.
3. Write about it on Medium, Dev.to or personal blog.


## Contribution guidelines

🚧 Under construction! 🚧


## Inspirations

This library is heavily inspired by [Angular's reactive forms](https://angular.io/guide/reactive-forms)
although it was adapted to match more "hook-like" or "signal-like" form of accessing form group state.

Many thanks to all people who contributed to growth of Angular's reactive forms over the years! 🙏
