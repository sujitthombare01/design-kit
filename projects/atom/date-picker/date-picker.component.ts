import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  type AbstractControl,
  type ControlValueAccessor,
  type ValidationErrors,
  type Validator,
} from '@angular/forms';

import type { DatePickerSize, DatePickerType } from './date-picker.types';

let nextDatePickerId = 0;

@Component({
  selector: 'design-kit-atom-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DesignKitAtomDatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DesignKitAtomDatePickerComponent),
      multi: true,
    },
  ],
})
export class DesignKitAtomDatePickerComponent implements ControlValueAccessor, Validator {
  readonly type = input<DatePickerType>('date');
  readonly size = input<DatePickerSize>('md');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly min = input<string | undefined>(undefined);
  readonly max = input<string | undefined>(undefined);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly label = input.required<string>();

  readonly value = model<string>('');
  readonly blurred = output<FocusEvent>();

  protected readonly inputId = `design-kit-atom-date-picker-${String(nextDatePickerId++)}`;
  protected readonly helperId = `${this.inputId}-helper`;
  protected readonly errorId = `${this.inputId}-error`;

  private readonly cvaDisabled = signal(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- default no-op until registerOnChange wires the real CVA callback
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- default no-op until registerOnTouched wires the real CVA callback
  private onTouched: () => void = () => {};

  protected readonly effectiveDisabled = computed<boolean>(
    () => this.disabled() || this.cvaDisabled(),
  );

  protected readonly describedBy = computed<string | null>(() => {
    if (this.invalid() && this.errorText()) {
      return this.errorId;
    }
    if (this.helperText()) {
      return this.helperId;
    }
    return null;
  });

  protected readonly fieldClasses = computed<string>(() => {
    const classes = [
      'design-kit-atom-date-picker-field',
      `design-kit-atom-date-picker-field--${this.size()}`,
    ];
    if (this.invalid()) {
      classes.push('design-kit-atom-date-picker-field--invalid');
    }
    if (this.effectiveDisabled()) {
      classes.push('design-kit-atom-date-picker-field--disabled');
    }
    if (this.readonly()) {
      classes.push('design-kit-atom-date-picker-field--readonly');
    }
    return classes.join(' ');
  });

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '').trim();

    if (this.required() && value === '') {
      return { required: true };
    }

    const min = this.min();
    if (value !== '' && min !== undefined && value < min) {
      return { min: { min, actual: value } };
    }

    const max = this.max();
    if (value !== '' && max !== undefined && value > max) {
      return { max: { max, actual: value } };
    }

    return null;
  }

  protected handleInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}
