import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslPagination } from './pagination';

const meta: Meta = {
  title: 'Navigation/Pagination',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslPagination] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslPagination, paginationRange } from '@tassili/ui/pagination';
\`\`\`

Bind \`[(page)]\` and \`pageCount\`. Previous/Next keep their text from the \`sm\` breakpoint up and show only arrows on small screens (still labelled for screen readers). \`paginationRange()\` is exported for custom layouts.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    props: { page: 5 },
    template: `
      <div class="grid gap-3">
        <tsl-pagination [(page)]="page" [pageCount]="12" />
        <p class="text-center text-sm text-muted-foreground">Page {{ page }} of 12</p>
      </div>
    `,
  }),
};

export const FewPages: Story = {
  render: () => ({
    props: { page: 1 },
    template: `<tsl-pagination [(page)]="page" [pageCount]="4" />`,
  }),
};

export const MoreSiblings: Story = {
  render: () => ({
    props: { page: 10 },
    template: `<tsl-pagination [(page)]="page" [pageCount]="40" [siblings]="2" />`,
  }),
};
