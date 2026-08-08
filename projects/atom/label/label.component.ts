import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { LabelSize, LabelVariant } from './label.types';

@Component({
  selector: 'design-kit-atom-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './label.component.html',
  styleUrl: './label.component.css',
})
export class DesignKitAtomLabelComponent {
  readonly for = input.required<string>();
  readonly size = input<LabelSize>('md');
  readonly variant = input<LabelVariant>('default');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  protected readonly labelClasses = computed<string>(() => {
    const classes = [
      'design-kit-atom-label',
      `design-kit-atom-label--${this.size()}`,
      `design-kit-atom-label--${this.variant()}`,
    ];
    if (this.disabled()) {
      classes.push('design-kit-atom-label--disabled');
    }
    return classes.join(' ');
  });
}
