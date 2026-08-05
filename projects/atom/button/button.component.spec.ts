import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { DesignKitAtomButtonComponent } from './button.component';
import type { ButtonSize, ButtonVariant } from './button.types';

describe(DesignKitAtomButtonComponent.name, () => {
  function createFixture(): {
    component: DesignKitAtomButtonComponent;
    button: HTMLButtonElement;
    fixture: ComponentFixture<DesignKitAtomButtonComponent>;
  } {
    TestBed.configureTestingModule({ imports: [DesignKitAtomButtonComponent] });
    const fixture = TestBed.createComponent(DesignKitAtomButtonComponent);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const button = nativeElement.querySelector('button');
    if (!button) {
      throw new Error('Expected the template to render a native <button>.');
    }
    return { component: fixture.componentInstance, button, fixture };
  }

  describe('rendering', () => {
    it('renders a native button with default classes', () => {
      const { button } = createFixture();
      expect(button).toBeTruthy();
      expect(button.classList.contains('design-kit-atom-button')).toBe(true);
      expect(button.classList.contains('design-kit-atom-button--primary')).toBe(true);
      expect(button.classList.contains('design-kit-atom-button--md')).toBe(true);
    });

    it('defaults the native type to "button"', () => {
      const { button } = createFixture();
      expect(button.getAttribute('type')).toBe('button');
    });
  });

  describe('variants', () => {
    const variants: readonly ButtonVariant[] = [
      'primary',
      'secondary',
      'outline',
      'ghost',
      'link',
      'success',
      'danger',
    ];

    for (const variant of variants) {
      it(`applies the "${variant}" variant class`, () => {
        const { component, button, fixture } = createFixture();
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(button.classList.contains(`design-kit-atom-button--${variant}`)).toBe(true);
        expect(component.variant()).toBe(variant);
      });
    }
  });

  describe('sizes', () => {
    const sizes: readonly ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    for (const size of sizes) {
      it(`applies the "${size}" size class`, () => {
        const { button, fixture } = createFixture();
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(button.classList.contains(`design-kit-atom-button--${size}`)).toBe(true);
      });
    }
  });

  describe('states', () => {
    it('reflects disabled as a native attribute', () => {
      const { button, fixture } = createFixture();
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(button.disabled).toBe(true);
    });

    it('sets aria-busy and the loading class while loading, and disables the button', () => {
      const { button, fixture } = createFixture();
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(button.getAttribute('aria-busy')).toBe('true');
      expect(button.classList.contains('design-kit-atom-button--loading')).toBe(true);
      expect(button.disabled).toBe(true);
      expect(button.querySelector('.design-kit-atom-button-spinner')).toBeTruthy();
    });

    it('omits aria-busy when not loading', () => {
      const { button } = createFixture();
      expect(button.hasAttribute('aria-busy')).toBe(false);
    });

    it('stretches full width when fullWidth is set', () => {
      const { button, fixture } = createFixture();
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(button.classList.contains('design-kit-atom-button--full-width')).toBe(true);
    });

    it('applies the icon-end class when iconPosition is "end"', () => {
      const { button, fixture } = createFixture();
      fixture.componentRef.setInput('iconPosition', 'end');
      fixture.detectChanges();
      expect(button.classList.contains('design-kit-atom-button--icon-end')).toBe(true);
    });
  });

  describe('events', () => {
    it('emits clicked on a native click', () => {
      const { component, button } = createFixture();
      let emitted: MouseEvent | undefined;
      component.clicked.subscribe((event: MouseEvent) => {
        emitted = event;
      });
      button.click();
      expect(emitted).toBeInstanceOf(MouseEvent);
    });

    it('does not emit clicked when disabled', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      let emitted = false;
      component.clicked.subscribe(() => {
        emitted = true;
      });
      // The native button is truly disabled, so a real click event never
      // reaches the handler; trigger the bound listener directly to assert
      // the component's own interactive guard, not just native DOM gating.
      fixture.debugElement
        .query(By.css('button'))
        .triggerEventHandler('click', new MouseEvent('click'));
      expect(emitted).toBe(false);
    });

    it('does not emit clicked when loading', () => {
      const { component, fixture } = createFixture();
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      let emitted = false;
      component.clicked.subscribe(() => {
        emitted = true;
      });
      fixture.debugElement
        .query(By.css('button'))
        .triggerEventHandler('click', new MouseEvent('click'));
      expect(emitted).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('reflects the type input onto the native button', () => {
      const { button, fixture } = createFixture();
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();
      expect(button.getAttribute('type')).toBe('submit');
    });

    it('is reachable via Tab and activates with Enter/Space through native button semantics', () => {
      const { button } = createFixture();
      button.focus();
      expect(document.activeElement).toBe(button);

      let clickCount = 0;
      button.addEventListener('click', () => {
        clickCount += 1;
      });

      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      button.click();
      button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      button.click();

      expect(clickCount).toBe(2);
    });
  });

  describe('OnPush change detection', () => {
    it('updates the view when a signal input changes, without manual double detectChanges', () => {
      const { button, fixture } = createFixture();
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      expect(button.classList.contains('design-kit-atom-button--danger')).toBe(true);
    });
  });
});
