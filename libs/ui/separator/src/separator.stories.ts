import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslSeparator } from './separator';

const meta: Meta = {
  title: 'Primitives/Separator',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslSeparator] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslSeparator } from '@tassili/ui/separator';
\`\`\`

A hairline between groups of content. Prefer spacing first; reach for a separator when spacing alone doesn't make the grouping clear.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => ({
    template: `
      <div class="w-72">
        <p class="text-sm font-medium">Tassili UI</p>
        <p class="text-sm text-muted-foreground">Accessible Angular components.</p>
        <tsl-separator class="my-4" />
        <p class="text-sm text-muted-foreground">Version 0.1</p>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <div class="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <tsl-separator orientation="vertical" />
        <span>Components</span>
        <tsl-separator orientation="vertical" />
        <span>Changelog</span>
      </div>
    `,
  }),
};
