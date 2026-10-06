import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslSkeleton } from './skeleton';

const meta: Meta = {
  title: 'Primitives/Skeleton',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslSkeleton] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslSkeleton } from '@tassili/ui/skeleton';
\`\`\`

Mirror the shape of the content that is loading so the layout doesn't jump. Put \`aria-busy="true"\` and a label on the loading region; the skeletons themselves are hidden from assistive tech.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ProfileRow: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3" aria-busy="true" aria-label="Loading profile">
        <tsl-skeleton class="size-10 rounded-full" />
        <div class="grid gap-2">
          <tsl-skeleton class="h-4 w-40" />
          <tsl-skeleton class="h-3 w-28" />
        </div>
      </div>
    `,
  }),
};

export const Card: Story = {
  render: () => ({
    template: `
      <div class="grid w-72 gap-3 rounded-lg border p-4" aria-busy="true" aria-label="Loading article">
        <tsl-skeleton class="h-36 w-full rounded-md" />
        <tsl-skeleton class="h-5 w-3/4" />
        <tsl-skeleton class="h-4 w-full" />
        <tsl-skeleton class="h-4 w-5/6" />
      </div>
    `,
  }),
};
