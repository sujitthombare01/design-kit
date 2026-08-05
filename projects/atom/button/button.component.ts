import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import type { ButtonIconPosition, ButtonNativeType, ButtonSize, ButtonVariant } from './button.types';

@Component({
  selector: 'design-kit-atom-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class DesignKitAtomButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly type = input<ButtonNativeType>('button');
  readonly fullWidth = input<boolean>(false);
  readonly iconPosition = input<ButtonIconPosition>('start');

  readonly clicked = output<MouseEvent>();

  protected readonly isInteractive = computed(() => !this.disabled() && !this.loading());

  protected readonly buttonClasses = computed<string>(() => {
    const classes = [
      'design-kit-atom-button',
      `design-kit-atom-button--${this.variant()}`,
      `design-kit-atom-button--${this.size()}`,
    ];
    if (this.fullWidth()) {
      classes.push('design-kit-atom-button--full-width');
    }
    if (this.loading()) {
      classes.push('design-kit-atom-button--loading');
    }
    if (this.iconPosition() === 'end') {
      classes.push('design-kit-atom-button--icon-end');
    }
    return classes.join(' ');
  });

  protected handleClick(event: MouseEvent): void {
    if (!this.isInteractive()) {
      return;
    }
    this.clicked.emit(event);
  }
}
