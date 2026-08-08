import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { DesignKitAtomLabelComponent } from './label.component';
import type { LabelSize, LabelVariant } from './label.types';

function query(root: HTMLElement, selector: string): Element {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Expected to find "${selector}" in the rendered fixture.`);
  }
  return element;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DesignKitAtomLabelComponent],
  template: `<design-kit-atom-label for="email-input">Email address</design-kit-atom-label>`,
})
// An Angular component class legitimately has no members when its template needs no bindings.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class ProjectedContentHostComponent {}

describe(DesignKitAtomLabelComponent.name, () => {
  function createFixture(): {
    component: DesignKitAtomLabelComponent;
    label: HTMLLabelElement;
    root: HTMLElement;
    fixture: ComponentFixture<DesignKitAtomLabelComponent>;
  } {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [DesignKitAtomLabelComponent] });
    const fixture = TestBed.createComponent(DesignKitAtomLabelComponent);
    fixture.componentRef.setInput('for', 'email-input');
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const label = query(root, 'label') as HTMLLabelElement;
    return { component: fixture.componentInstance, label, root, fixture };
  }

  describe('rendering', () => {
    it('renders a native label associated with the given control id', () => {
      const { label } = createFixture();
      expect(label.getAttribute('for')).toBe('email-input');
    });

    it('projects its content as the label text', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [ProjectedContentHostComponent] });
      const fixture = TestBed.createComponent(ProjectedContentHostComponent);
      fixture.detectChanges();
      const label = query(fixture.nativeElement as HTMLElement, 'label') as HTMLLabelElement;
      expect(label.textContent.trim()).toBe('Email address');
    });

    it('defaults size to md and variant to default', () => {
      const { label } = createFixture();
      expect(label.classList.contains('design-kit-atom-label--md')).toBe(true);
      expect(label.classList.contains('design-kit-atom-label--default')).toBe(true);
    });
  });

  describe('sizes', () => {
    const sizes: readonly LabelSize[] = ['sm', 'md', 'lg'];

    for (const size of sizes) {
      it(`applies the "${size}" size class`, () => {
        const { label, fixture } = createFixture();
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(label.classList.contains(`design-kit-atom-label--${size}`)).toBe(true);
      });
    }
  });

  describe('variants', () => {
    const variants: readonly LabelVariant[] = ['default', 'error'];

    for (const variant of variants) {
      it(`applies the "${variant}" variant class`, () => {
        const { component, label, fixture } = createFixture();
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(label.classList.contains(`design-kit-atom-label--${variant}`)).toBe(true);
        expect(component.variant()).toBe(variant);
      });
    }
  });

  describe('states', () => {
    it('renders no required indicator by default', () => {
      const { root } = createFixture();
      expect(root.querySelector('.design-kit-atom-label-required-indicator')).toBeNull();
    });

    it('renders an aria-hidden required indicator when required is true', () => {
      const { root, fixture } = createFixture();
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const indicator = query(root, '.design-kit-atom-label-required-indicator');
      expect(indicator.getAttribute('aria-hidden')).toBe('true');
    });

    it('applies the disabled class when disabled is set, purely as a visual flag', () => {
      const { label, fixture } = createFixture();
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(label.classList.contains('design-kit-atom-label--disabled')).toBe(true);
      // Label has no native disabled semantics of its own — `for` stays
      // wired to the associated control regardless.
      expect(label.getAttribute('for')).toBe('email-input');
    });
  });

  describe('accessibility', () => {
    it('does not expose the required indicator to assistive tech', () => {
      const { root, fixture } = createFixture();
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const indicator = query(root, '.design-kit-atom-label-required-indicator');
      expect(indicator.getAttribute('aria-hidden')).toBe('true');
    });

    it('reflects a changed "for" input onto the native attribute', () => {
      const { label, fixture } = createFixture();
      fixture.componentRef.setInput('for', 'password-input');
      fixture.detectChanges();
      expect(label.getAttribute('for')).toBe('password-input');
    });
  });

  describe('OnPush change detection', () => {
    it('updates the view when a signal input changes, without manual double detectChanges', () => {
      const { label, fixture } = createFixture();
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(label.classList.contains('design-kit-atom-label--error')).toBe(true);
    });
  });
});
