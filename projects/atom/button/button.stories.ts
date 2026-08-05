import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { DesignKitAtomButtonComponent } from './button.component';
import type { ButtonIconPosition, ButtonSize, ButtonVariant } from './button.types';

const variants: readonly ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link',
  'success',
  'danger',
];
const sizes: readonly ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const iconPositions: readonly ButtonIconPosition[] = ['start', 'end'];

const meta: Meta<DesignKitAtomButtonComponent> = {
  title: 'Atoms/Button',
  component: DesignKitAtomButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    iconPosition: { control: 'select', options: iconPositions },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    clicked: { action: 'clicked' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    iconPosition: 'start',
    type: 'button',
  },
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
      [fullWidth]="fullWidth"
      [iconPosition]="iconPosition"
      [type]="type"
      (clicked)="clicked($event)"
    >Button</design-kit-atom-button>`,
  }),
};

export default meta;
type Story = StoryObj<DesignKitAtomButtonComponent>;

export const Default: Story = {};

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Link: Story = { args: { variant: 'link' } };
export const Success: Story = { args: { variant: 'success' } };
export const Danger: Story = { args: { variant: 'danger' } };

export const ExtraSmall: Story = { args: { size: 'xs' } };
export const Small: Story = { args: { size: 'sm' } };
export const Medium: Story = { args: { size: 'md' } };
export const Large: Story = { args: { size: 'lg' } };
export const ExtraLarge: Story = { args: { size: 'xl' } };

export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const FullWidth: Story = { args: { fullWidth: true } };

export const IconStart: Story = {
  args: { iconPosition: 'start' },
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-button [variant]="variant" [size]="size" [iconPosition]="iconPosition">
      <span slot="icon" aria-hidden="true">★</span>
      Button
    </design-kit-atom-button>`,
  }),
};

export const IconEnd: Story = {
  args: { iconPosition: 'end' },
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-button [variant]="variant" [size]="size" [iconPosition]="iconPosition">
      <span slot="icon" aria-hidden="true">★</span>
      Button
    </design-kit-atom-button>`,
  }),
};

export const Focus: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

export const AllVariantsAllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${variants
          .map(
            (variant) => `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${sizes
              .map(
                (size) =>
                  `<design-kit-atom-button variant="${variant}" size="${size}">${variant} / ${size}</design-kit-atom-button>`,
              )
              .join('')}
          </div>`,
          )
          .join('')}
      </div>
    `,
  }),
};
