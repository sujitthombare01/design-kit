export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps {
  readonly type: InputType;
  readonly size: InputSize;
  readonly value: string;
  readonly placeholder: string;
  readonly disabled: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly invalid: boolean;
  readonly helperText: string | undefined;
  readonly errorText: string | undefined;
  readonly label: string;
}
