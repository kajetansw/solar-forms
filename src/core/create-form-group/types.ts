type TODO = any;

type ValidationErrors = {
  [key: string]: TODO;
};

interface ValidatorFn {
  (control: TODO): ValidationErrors | null;
}

type FormGroupPrimitive = string | number | boolean | Date | null;

type FormGroupConfig = {
  disabled?: boolean;
  validators?: ValidatorFn[];
};

export type FormGroupValueConfigTuple = [FormGroupPrimitive, FormGroupConfig];

export type CreateFormGroupInput = {
  [key: string]: FormGroupPrimitive | FormGroupValueConfigTuple | CreateFormGroupInput;
};
