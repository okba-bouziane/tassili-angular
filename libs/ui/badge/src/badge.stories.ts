import { LucideCircleCheck } from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslIcon } from '@tassili/ui/icon';
import { TslBadge } from './badge';

const meta: Meta = {
  title: 'Primitives/Badge',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslBadge, TslIcon] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslBadge } from '@tassili/ui/badge';
\`\`\`

Short labels for status, categories and counts. Tassili badges use a tight 4px radius rather than pills. Keep the text explicit ("Paid", "Overdue"): color supports the meaning but never carries it alone. \`brand\` (red ochre) is for rare highlights such as "New".
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <span tslBadge variant="primary">Primary</span>
        <span tslBadge>Secondary</span>
        <span tslBadge variant="outline">Outline</span>
        <span tslBadge variant="brand">New</span>
        <span tslBadge variant="success">Paid</span>
        <span tslBadge variant="warning">Pending</span>
        <span tslBadge variant="info">Beta</span>
        <span tslBadge variant="destructive">Overdue</span>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-2">
        <span tslBadge size="sm">Small</span>
        <span tslBadge size="md">Medium</span>
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    props: { check: LucideCircleCheck },
    template: `<span tslBadge variant="success"><tsl-icon [icon]="check" size="xs" />Verified</span>`,
  }),
};

export const AsLink: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <a tslBadge variant="outline" href="#">angular</a>
        <a tslBadge variant="outline" href="#">design-systems</a>
      </div>
    `,
  }),
};

export const Count: Story = {
  render: () => ({
    template: `
      <span class="inline-flex items-center gap-2 text-sm">Inbox <span tslBadge variant="primary" size="sm" class="tabular-nums">12</span></span>
    `,
  }),
};
