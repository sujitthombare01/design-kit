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

import type { InputSize, InputType } from './input.types';

let nextInputId = 0;

@Component({
  selector: 'design-kit-atom-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DesignKitAtomInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DesignKitAtomInputComponent),
      multi: true,
    },
  ],
})
export class DesignKitAtomInputComponent implements ControlValueAccessor, Validator {
  readonly type = input<InputType>('text');
  readonly size = input<InputSize>('md');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly label = input.required<string>();

  readonly value = model<string>('');
  readonly blurred = output<FocusEvent>();

  protected readonly inputId = `design-kit-atom-input-${String(nextInputId++)}`;
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
      'design-kit-atom-input-field',
      `design-kit-atom-input-field--${this.size()}`,
    ];
    if (this.invalid()) {
      classes.push('design-kit-atom-input-field--invalid');
    }
    if (this.effectiveDisabled()) {
      classes.push('design-kit-atom-input-field--disabled');
    }
    if (this.readonly()) {
      classes.push('design-kit-atom-input-field--readonly');
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
    if (this.required() && String(control.value ?? '').trim() === '') {
      return { required: true };
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
