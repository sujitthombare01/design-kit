export type LabelSize = 'sm' | 'md' | 'lg';

export type LabelVariant = 'default' | 'error';

export interface LabelProps {
  readonly for: string;
  readonly size: LabelSize;
  readonly variant: LabelVariant;
  readonly required: boolean;
  readonly disabled: boolean;
}
