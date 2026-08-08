import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { DesignKitAtomDatePickerComponent } from './date-picker.component';
import type { DatePickerSize, DatePickerType } from './date-picker.types';

const types: readonly DatePickerType[] = ['date', 'datetime-local'];
const sizes: readonly DatePickerSize[] = ['sm', 'md', 'lg'];

const meta: Meta<DesignKitAtomDatePickerComponent> = {
  title: 'Atoms/DatePicker',
  component: DesignKitAtomDatePickerComponent,
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
    label: 'Appointment date',
    type: 'date',
    size: 'md',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    value: '',
  },
  render: (args) => ({
    props: args,
    template: `<design-kit-atom-date-picker
      [label]="label"
      [type]="type"
      [size]="size"
      [disabled]="disabled"
      [readonly]="readonly"
      [required]="required"
      [invalid]="invalid"
      [min]="min"
      [max]="max"
      [helperText]="helperText"
      [errorText]="errorText"
      [value]="value"
    />`,
  }),
};

export default meta;
type Story = StoryObj<DesignKitAtomDatePickerComponent>;

export const Default: Story = {};

export const DateType: Story = { args: { type: 'date' } };
export const DateTimeType: Story = {
  args: { type: 'datetime-local', label: 'Appointment date and time' },
};

export const Small: Story = { args: { size: 'sm' } };
export const Medium: Story = { args: { size: 'md' } };
export const Large: Story = { args: { size: 'lg' } };

export const Disabled: Story = { args: { disabled: true, value: '2026-06-15' } };
export const Readonly: Story = { args: { readonly: true, value: '2026-06-15' } };
export const Required: Story = { args: { required: true } };

export const WithMinMax: Story = {
  args: { min: '2026-01-01', max: '2026-12-31', helperText: 'Pick a date within 2026.' },
};

export const WithHelperText: Story = {
  args: { helperText: 'Appointments are available on business days only.' },
};

export const WithError: Story = {
  args: { invalid: true, errorText: 'Choose a valid appointment date.' },
};

export const Focus: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Appointment date');
    await userEvent.click(input);
    await userEvent.keyboard('2026-06-15');
    await expect(input).toHaveValue('2026-06-15');
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 20rem;">
        ${sizes
          .map(
            (size) =>
              `<design-kit-atom-date-picker label="Size ${size}" size="${size}"></design-kit-atom-date-picker>`,
          )
          .join('')}
      </div>
    `,
  }),
};
