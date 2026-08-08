import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { DesignKitAtomLabelComponent } from './label.component';
import type { LabelSize, LabelVariant } from './label.types';

const sizes: readonly LabelSize[] = ['sm', 'md', 'lg'];
const variants: readonly LabelVariant[] = ['default', 'error'];

const meta: Meta<DesignKitAtomLabelComponent> = {
  title: 'Atoms/Label',
  component: DesignKitAtomLabelComponent,
  tags: ['autodocs'],
  argTypes: {
    for: { control: 'text' },
    size: { control: 'select', options: sizes },
    variant: { control: 'select', options: variants },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    for: 'demo-field',
    size: 'md',
    variant: 'default',
    required: false,
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-label
      [for]="for"
      [size]="size"
      [variant]="variant"
      [required]="required"
      [disabled]="disabled"
    >Email address</design-kit-atom-label>`,
  }),
};

export default meta;
type Story = StoryObj<DesignKitAtomLabelComponent>;

export const Default: Story = {};

export const SmallSize: Story = { args: { size: 'sm' } };
export const MediumSize: Story = { args: { size: 'md' } };
export const LargeSize: Story = { args: { size: 'lg' } };

export const ErrorVariant: Story = { args: { variant: 'error' } };

export const Required: Story = { args: { required: true } };

export const Disabled: Story = { args: { disabled: true } };

export const PairedWithControl: Story = {
  name: 'Paired with a form control',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 4px; max-width: 240px;">
        <design-kit-atom-label for="paired-demo-input" [required]="true">
          Email address
        </design-kit-atom-label>
        <input id="paired-demo-input" type="email" placeholder="you@example.com" />
      </div>
    `,
  }),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Email address');
    await userEvent.click(label);
    const control = canvas.getByPlaceholderText('you@example.com');
    await expect(control).toHaveFocus();
  },
};

export const AllSizesAllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${sizes
          .map(
            (size) => `
          <div style="display: flex; align-items: baseline; gap: 1rem;">
            ${variants
              .map(
                (variant) =>
                  `<design-kit-atom-label for="demo-field" size="${size}" variant="${variant}">${size} / ${variant}</design-kit-atom-label>`,
              )
              .join('')}
          </div>`,
          )
          .join('')}
      </div>
    `,
  }),
};
