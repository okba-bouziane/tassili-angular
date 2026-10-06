import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { TslSpinner } from './spinner';

const meta: Meta = {
  title: 'Primitives/Spinner',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslSpinner, TslButton] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslSpinner } from '@tassili/ui/spinner';
\`\`\`

For short waits where progress can't be measured. Prefer a Skeleton when the content's shape is known, and a Progress bar when progress is. Inside a button, mark the spinner \`decorative\` and change the label to say what's happening ("Saving…").
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-4 text-primary">
        <tsl-spinner size="sm" />
        <tsl-spinner size="md" />
        <tsl-spinner size="lg" />
        <tsl-spinner size="xl" />
      </div>
    `,
  }),
};

export const InButton: Story = {
  render: () => ({
    template: `
      <div class="flex gap-3">
        <button tslButton disabled><tsl-spinner decorative />Saving…</button>
        <button tslButton variant="outline" disabled><tsl-spinner decorative />Loading</button>
      </div>
    `,
  }),
};

export const WithLabel: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <tsl-spinner decorative />
        <span role="status">Syncing your workspace</span>
      </div>
    `,
  }),
};
