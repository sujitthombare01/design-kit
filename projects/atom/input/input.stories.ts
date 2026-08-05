import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { DesignKitAtomInputComponent } from './input.component';
import type { InputSize, InputType } from './input.types';

const types: readonly InputType[] = ['text', 'email', 'password', 'number', 'search', 'tel', 'url'];
const sizes: readonly InputSize[] = ['sm', 'md', 'lg'];

const meta: Meta<DesignKitAtomInputComponent> = {
  title: 'Atoms/Input',
  component: DesignKitAtomInputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: types },
    size: { control: 'select', options: sizes },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    label: 'Email address',
    type: 'text',
    size: 'md',
    placeholder: '',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    value: '',
  },
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-input
      [label]="label"
      [type]="type"
      [size]="size"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [required]="required"
      [invalid]="invalid"
      [helperText]="helperText"
      [errorText]="errorText"
      [value]="value"
    />`,
  }),
};

export default meta;
type Story = StoryObj<DesignKitAtomInputComponent>;

export const Default: Story = {};

export const TextType: Story = { args: { type: 'text' } };
export const EmailType: Story = { args: { type: 'email' } };
export const PasswordType: Story = { args: { type: 'password' } };
export const NumberType: Story = { args: { type: 'number' } };
export const SearchType: Story = { args: { type: 'search' } };
export const TelType: Story = { args: { type: 'tel' } };
export const UrlType: Story = { args: { type: 'url' } };

export const Small: Story = { args: { size: 'sm' } };
export const Medium: Story = { args: { size: 'md' } };
export const Large: Story = { args: { size: 'lg' } };

export const Disabled: Story = { args: { disabled: true, value: 'Cannot edit' } };
export const Readonly: Story = { args: { readonly: true, value: 'Cannot edit, still selectable' } };
export const Required: Story = { args: { required: true } };

export const WithHelperText: Story = {
  args: { helperText: 'We will never share your email.' },
};

export const WithError: Story = {
  args: { invalid: true, errorText: 'Enter a valid email address.' },
};

export const WithPrefixIcon: Story = {
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-input [label]="label" [type]="type" [size]="size">
      <span slot="prefix" aria-hidden="true">@</span>
    </design-kit-atom-input>`,
  }),
};

export const WithSuffixIcon: Story = {
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-input [label]="label" [type]="type" [size]="size">
      <span slot="suffix" aria-hidden="true">✓</span>
    </design-kit-atom-input>`,
  }),
};

export const Focus: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email address');
    await userEvent.click(input);
    await userEvent.keyboard('hello@example.com');
    await expect(input).toHaveValue('hello@example.com');
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 20rem;">
        ${sizes
          .map(
            (size) =>
              `<design-kit-atom-input label="Size ${size}" size="${size}" placeholder="Size ${size}"></design-kit-atom-input>`,
          )
          .join('')}
      </div>
    `,
  }),
};
