import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslInput } from '@tassili/ui/input';
import { TslLabel } from './label';

const meta: Meta = {
  title: 'Primitives/Label',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslLabel, TslInput] })],
  parameters: {
    docs: {
      description: {
        component: `
Apply \`tslLabel\` to a native \`<label>\`. Link it with \`for\`, or let the Form Field wrapper link it for you.

\`\`\`ts
import { TslLabel } from '@tassili/ui/label';
\`\`\`

Labels are short nouns in sentence case, without a trailing colon.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <div class="grid w-72 gap-2">
        <label tslLabel for="workspace">Workspace name</label>
        <input tslInput id="workspace" placeholder="Atlas Studio" />
      </div>
    `,
  }),
};

export const DisabledPeer: Story = {
  render: () => ({
    template: `
      <div class="grid w-72 gap-2">
        <input tslInput id="slug" class="peer order-2" value="atlas-studio" disabled />
        <label tslLabel for="slug" class="order-1">Workspace URL</label>
      </div>
    `,
  }),
};
