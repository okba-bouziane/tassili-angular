import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslLabel } from '@tassili/ui/label';
import { TslTextarea } from './textarea';

interface TextareaArgs {
  autoResize: boolean;
  disabled: boolean;
  forceInvalid: boolean;
  placeholder: string;
}

const meta: Meta<TextareaArgs> = {
  title: 'Primitives/Textarea',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslTextarea, TslLabel] })],
  parameters: {
    docs: {
      description: {
        component: `
Apply \`tslTextarea\` to a native \`<textarea>\`. Same form integration and error behaviour as Input.

\`\`\`ts
import { TslTextarea } from '@tassili/ui/textarea';
\`\`\`

Use \`autoResize\` for short free text that should grow as people type (comments, bios).
`,
      },
    },
  },
  args: {
    autoResize: false,
    disabled: false,
    forceInvalid: false,
    placeholder: 'Tell people what you work on',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="grid w-96 gap-2">
        <label tslLabel for="bio">Bio</label>
        <textarea tslTextarea id="bio" rows="4" [autoResize]="autoResize" [placeholder]="placeholder"
          [disabled]="disabled" [forceInvalid]="forceInvalid"></textarea>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<TextareaArgs>;

export const Playground: Story = {};
export const AutoResize: Story = { args: { autoResize: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { forceInvalid: true } };
