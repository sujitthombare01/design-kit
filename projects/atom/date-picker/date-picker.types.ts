export type DatePickerType = 'date' | 'datetime-local';

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps {
  readonly type: DatePickerType;
  readonly size: DatePickerSize;
  readonly value: string;
  readonly disabled: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly invalid: boolean;
  readonly min: string | undefined;
  readonly max: string | undefined;
  readonly helperText: string | undefined;
  readonly errorText: string | undefined;
  readonly label: string;
}
