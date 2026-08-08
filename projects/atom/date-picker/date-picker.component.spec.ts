import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { DesignKitAtomDatePickerComponent } from './date-picker.component';
import type { DatePickerSize, DatePickerType } from './date-picker.types';

function query(root: HTMLElement, selector: string): Element {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Expected to find "${selector}" in the rendered fixture.`);
  }
  return element;
}

describe(DesignKitAtomDatePickerComponent.name, () => {
  function createFixture(): {
    component: DesignKitAtomDatePickerComponent;
    input: HTMLInputElement;
    root: HTMLElement;
    fixture: ComponentFixture<DesignKitAtomDatePickerComponent>;
  } {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [DesignKitAtomDatePickerComponent] });
    const fixture = TestBed.createComponent(DesignKitAtomDatePickerComponent);
    fixture.componentRef.setInput('label', 'Appointment date');
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const input = query(root, 'input') as HTMLInputElement;
    return { component: fixture.componentInstance, input, root, fixture };
  }

  describe('rendering', () => {
    it('renders a labelled native input', () => {
      const { root, input } = createFixture();
      const label = query(root, 'label') as HTMLLabelElement;
      expect(input).toBeTruthy();
      expect(label.textContent.trim()).toBe('Appointment date');
      expect(label.getAttribute('for')).toBe(input.id);
    });

    it('defaults type to date and size class to md', () => {
      const { input, root } = createFixture();
      expect(input.type).toBe('date');
      const field = query(root, '.design-kit-atom-date-picker-field') as HTMLElement;
      expect(field.classList.contains('design-kit-atom-date-picker-field--md')).toBe(true);
    });

    it('generates a unique id per instance', () => {
      const first = createFixture();
      const second = createFixture();
      expect(first.input.id).not.toBe(second.input.id);
    });
  });

  describe('types', () => {
    const types: readonly DatePickerType[] = ['date', 'datetime-local'];

    for (const type of types) {
      it(`reflects the "${type}" type onto the native input`, () => {
        const { input, fixture } = createFixture();
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();
        expect(input.type).toBe(type);
      });
    }
  });

  describe('sizes', () => {
    const sizes: readonly DatePickerSize[] = ['sm', 'md', 'lg'];

    for (const size of sizes) {
      it(`applies the "${size}" size class`, () => {
        const { fixture, root } = createFixture();
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const field = query(root, '.design-kit-atom-date-picker-field') as HTMLElement;
        expect(field.classList.contains(`design-kit-atom-date-picker-field--${size}`)).toBe(true);
      });
    }
  });

  describe('states', () => {
    it('reflects disabled as a native attribute via the plain input', () => {
      const { input, fixture } = createFixture();
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(input.disabled).toBe(true);
    });

    it('reflects disabled via CVA setDisabledState', () => {
      const { component, input, fixture } = createFixture();
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(input.disabled).toBe(true);
    });

    it('is not disabled when neither the plain input nor CVA disable it', () => {
      const { input } = createFixture();
      expect(input.disabled).toBe(false);
    });

    it('reflects readonly as a native attribute and class', () => {
      const { input, fixture, root } = createFixture();
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(input.hasAttribute('readonly')).toBe(true);
      const field = query(root, '.design-kit-atom-date-picker-field') as HTMLElement;
      expect(field.classList.contains('design-kit-atom-date-picker-field--readonly')).toBe(true);
    });

    it('reflects required as a native attribute and aria-required', () => {
      const { input, fixture } = createFixture();
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(input.hasAttribute('required')).toBe(true);
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('omits aria-required when not required', () => {
      const { input } = createFixture();
      expect(input.hasAttribute('required')).toBe(false);
      expect(input.getAttribute('aria-required')).toBeNull();
    });

    it('sets aria-invalid and the invalid class when invalid', () => {
      const { input, fixture, root } = createFixture();
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();
      expect(input.getAttribute('aria-invalid')).toBe('true');
      const field = query(root, '.design-kit-atom-date-picker-field') as HTMLElement;
      expect(field.classList.contains('design-kit-atom-date-picker-field--invalid')).toBe(true);
    });

    it('omits aria-invalid when valid', () => {
      const { input } = createFixture();
      expect(input.getAttribute('aria-invalid')).toBeNull();
    });
  });

  describe('min and max', () => {
    it('reflects min and max as native attributes', () => {
      const { input, fixture } = createFixture();
      fixture.componentRef.setInput('min', '2026-01-01');
      fixture.componentRef.setInput('max', '2026-12-31');
      fixture.detectChanges();
      expect(input.getAttribute('min')).toBe('2026-01-01');
      expect(input.getAttribute('max')).toBe('2026-12-31');
    });

    it('omits min and max attributes when unset', () => {
      const { input } = createFixture();
      expect(input.hasAttribute('min')).toBe(false);
      expect(input.hasAttribute('max')).toBe(false);
    });
  });

  describe('helper and error text', () => {
    it('renders helperText and points aria-describedby at it', () => {
      const { input, fixture, root } = createFixture();
      fixture.componentRef.setInput('helperText', 'Choose a business day.');
      fixture.detectChanges();
      const helper = query(root, '.design-kit-atom-date-picker-helper') as HTMLElement;
      expect(helper.textContent.trim()).toBe('Choose a business day.');
      expect(input.getAttribute('aria-describedby')).toBe(helper.id);
    });

    it('renders errorText instead of helperText when invalid, and points aria-describedby at it', () => {
      const { input, fixture, root } = createFixture();
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('errorText', 'Date is required.');
      fixture.detectChanges();
      const error = query(root, '.design-kit-atom-date-picker-error') as HTMLElement;
      const helper = root.querySelector('.design-kit-atom-date-picker-helper');
      expect(error.textContent.trim()).toBe('Date is required.');
      expect(helper).toBeNull();
      expect(input.getAttribute('aria-describedby')).toBe(error.id);
    });

    it('omits aria-describedby when neither helperText nor errorText is present', () => {
      const { input } = createFixture();
      expect(input.hasAttribute('aria-describedby')).toBe(false);
    });
  });

  describe('events', () => {
    it('emits valueChange and updates value() on native input', () => {
      const { component, input, fixture } = createFixture();
      let emitted: string | undefined;
      component.value.subscribe((value: string) => {
        emitted = value;
      });
      input.value = '2026-03-05';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      expect(component.value()).toBe('2026-03-05');
      expect(emitted).toBe('2026-03-05');
    });

    it('emits blurred on native blur', () => {
      const { component, input } = createFixture();
      let emitted: FocusEvent | undefined;
      component.blurred.subscribe((event: FocusEvent) => {
        emitted = event;
      });
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      expect(emitted).toBeInstanceOf(FocusEvent);
    });
  });

  describe('forms integration', () => {
    it('writeValue sets the rendered input value', () => {
      const { component, input, fixture } = createFixture();
      component.writeValue('2026-05-01');
      fixture.detectChanges();
      expect(input.value).toBe('2026-05-01');
    });

    it('writeValue(null) clears the value', () => {
      const { component, input, fixture } = createFixture();
      component.writeValue('2026-05-01');
      fixture.detectChanges();
      component.writeValue(null);
      fixture.detectChanges();
      expect(input.value).toBe('');
    });

    it('calls the registered onChange callback from a native input event', () => {
      const { component, input } = createFixture();
      let received: string | undefined;
      component.registerOnChange((value: string) => {
        received = value;
      });
      input.value = '2026-06-15';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(received).toBe('2026-06-15');
    });

    it('calls the registered onTouched callback from a native blur event', () => {
      const { component, input } = createFixture();
      let touched = false;
      component.registerOnTouched(() => {
        touched = true;
      });
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      expect(touched).toBe(true);
    });

    it('validate returns null when required is false, regardless of value', () => {
      const { component } = createFixture();
      const control = new FormControl('');
      expect(component.validate(control)).toBeNull();
    });

    it('validate returns required ValidationErrors when required and value is blank', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const control = new FormControl('   ');
      expect(component.validate(control)).toEqual({ required: true });
    });

    it('validate returns required ValidationErrors when required and control value is null', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const control = new FormControl(null);
      expect(component.validate(control)).toEqual({ required: true });
    });

    it('validate returns null when required and value is present', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const control = new FormControl('2026-05-01');
      expect(component.validate(control)).toBeNull();
    });

    it('validate returns min ValidationErrors when value is before min', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('min', '2026-01-01');
      fixture.detectChanges();
      const control = new FormControl('2025-12-31');
      expect(component.validate(control)).toEqual({
        min: { min: '2026-01-01', actual: '2025-12-31' },
      });
    });

    it('validate returns max ValidationErrors when value is after max', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('max', '2026-12-31');
      fixture.detectChanges();
      const control = new FormControl('2027-01-01');
      expect(component.validate(control)).toEqual({
        max: { max: '2026-12-31', actual: '2027-01-01' },
      });
    });

    it('validate returns null when value is within min/max range', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('min', '2026-01-01');
      fixture.componentRef.setInput('max', '2026-12-31');
      fixture.detectChanges();
      const control = new FormControl('2026-06-15');
      expect(component.validate(control)).toBeNull();
    });

    it('validate skips min/max checks when value is empty', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('min', '2026-01-01');
      fixture.componentRef.setInput('max', '2026-12-31');
      fixture.detectChanges();
      const control = new FormControl('');
      expect(component.validate(control)).toBeNull();
    });

    it('round-trips through a bound reactive FormControl', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [ReactiveFormsHarnessComponent] });
      const fixture = TestBed.createComponent(ReactiveFormsHarnessComponent);
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const input = query(root, 'input') as HTMLInputElement;

      expect(input.value).toBe('2026-01-15');

      input.value = '2026-02-20';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.control.value).toBe('2026-02-20');

      fixture.componentInstance.control.disable();
      fixture.detectChanges();
      expect(input.disabled).toBe(true);

      fixture.componentInstance.control.setValue('');
      fixture.componentInstance.control.enable();
      fixture.detectChanges();
      expect(fixture.componentInstance.control.errors).toEqual({ required: true });
    });

    it('round-trips through ngModel', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [NgModelHarnessComponent] });
      const fixture = TestBed.createComponent(NgModelHarnessComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const input = query(root, 'input') as HTMLInputElement;

      expect(input.value).toBe('2026-03-10');

      input.value = '2026-04-22';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.model).toBe('2026-04-22');
    });
  });

  describe('accessibility', () => {
    it('is reachable via Tab', () => {
      const { input } = createFixture();
      input.focus();
      expect(document.activeElement).toBe(input);
    });
  });

  describe('OnPush change detection', () => {
    it('updates the view when a signal input changes, without manual double detectChanges', () => {
      const { fixture, root } = createFixture();
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const field = query(root, '.design-kit-atom-date-picker-field') as HTMLElement;
      expect(field.classList.contains('design-kit-atom-date-picker-field--lg')).toBe(true);
    });
  });
});

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DesignKitAtomDatePickerComponent, ReactiveFormsModule],
  template: `<design-kit-atom-date-picker label="Date" [formControl]="control" />`,
})
class ReactiveFormsHarnessComponent {
  // eslint-disable-next-line @typescript-eslint/unbound-method -- Validators.required is a pure static function that does not use `this`.
  readonly control = new FormControl('2026-01-15', Validators.required);
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DesignKitAtomDatePickerComponent, FormsModule],
  template: `<design-kit-atom-date-picker
    label="Date"
    [(ngModel)]="model"
    [ngModelOptions]="{ standalone: true }"
  />`,
})
class NgModelHarnessComponent {
  model = '2026-03-10';
}
