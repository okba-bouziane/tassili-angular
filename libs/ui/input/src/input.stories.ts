import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslLabel } from '@tassili/ui/label';
import { TslInput, type TslInputSize } from './input';

interface InputArgs {
  size: TslInputSize;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  forceInvalid: boolean;
}

const meta: Meta<InputArgs> = {
  title: 'Primitives/Input',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslInput, TslLabel] })],
  parameters: {
    docs: {
      description: {
        component: `
Apply \`tslInput\` to a native \`<input>\`. It works with reactive, template-driven and signal forms (\`[formControl]\`, \`ngModel\`, \`[formField]\`).

\`\`\`ts
import { TslInput } from '@tassili/ui/input';
\`\`\`

- Always pair an input with a visible label (\`tslLabel\`), or use the Form Field wrapper for labels, hints and errors.
- Placeholders show an example of valid input ("name@company.com"); they never replace the label.
- The error style and \`aria-invalid\` appear only after the user leaves an invalid field, or after submit.
`,
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    size: 'md',
    placeholder: 'name@company.com',
    disabled: false,
    readonly: false,
    forceInvalid: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="grid w-80 gap-2">
        <label tslLabel for="email">Email</label>
        <input tslInput id="email" type="email" [size]="size" [placeholder]="placeholder"
          [disabled]="disabled" [readOnly]="readonly" [forceInvalid]="forceInvalid" />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<InputArgs>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="grid w-80 gap-3">
        <input tslInput size="sm" aria-label="Small" placeholder="Small" />
        <input tslInput size="md" aria-label="Medium" placeholder="Medium" />
        <input tslInput size="lg" aria-label="Large" placeholder="Large" />
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="grid w-80 gap-4">
        <div class="grid gap-2"><label tslLabel for="s1">Default</label><input tslInput id="s1" placeholder="Atlas Studio" /></div>
        <div class="grid gap-2"><label tslLabel for="s2">Filled</label><input tslInput id="s2" value="Tassili n'Ajjer" /></div>
        <div class="grid gap-2"><label tslLabel for="s3">Read only</label><input tslInput id="s3" value="ws_8f2a91" readonly /></div>
        <div class="grid gap-2"><label tslLabel for="s4">Disabled</label><input tslInput id="s4" value="Locked by admin" disabled /></div>
        <div class="grid gap-2"><label tslLabel for="s5">Invalid</label><input tslInput id="s5" value="okba@" forceInvalid /></div>
      </div>
    `,
  }),
};

export const Types: Story = {
  render: () => ({
    template: `
      <div class="grid w-80 gap-3">
        <input tslInput type="password" aria-label="Password" value="hunter22" />
        <input tslInput type="search" aria-label="Search" placeholder="Search projects" />
        <input tslInput type="number" aria-label="Seats" value="12" />
        <input tslInput type="date" aria-label="Start date" />
        <input tslInput type="file" aria-label="Attachment" />
      </div>
    `,
  }),
};
