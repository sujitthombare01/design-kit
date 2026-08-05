export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'success'
  | 'danger';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonNativeType = 'button' | 'submit' | 'reset';

export type ButtonIconPosition = 'start' | 'end';

export interface ButtonProps {
  readonly variant: ButtonVariant;
  readonly size: ButtonSize;
  readonly disabled: boolean;
  readonly loading: boolean;
  readonly type: ButtonNativeType;
  readonly fullWidth: boolean;
  readonly iconPosition: ButtonIconPosition;
}
