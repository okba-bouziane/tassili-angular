import { LucideActivity, LucideLayoutGrid, LucideSettings } from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslIcon } from '@tassili/ui/icon';
import { TslTabsImports } from './tabs';

const meta: Meta = {
  title: 'Navigation/Tabs',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...TslTabsImports, TslIcon] })],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Switch between related views in the same place, without leaving the page.

\`\`\`ts
import { TslTabsImports } from '@tassili/ui/tabs';
\`\`\`

- \`line\` (default) underlines the active tab in indigo; \`segmented\` groups short options in a pill.
- Label the list with \`aria-label\`. Tab labels are short nouns.
- Use \`<ng-template tslTabsContentLazy>\` for heavy panels that should render only when opened.
- For navigation between pages, use links in a nav, not tabs.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const panels = `
  <div tslTabsContent="overview" class="rounded-lg border p-4">A summary of the project: owners, deadlines and open questions.</div>
  <div tslTabsContent="activity" class="rounded-lg border p-4">Recent comments, uploads and status changes.</div>
  <div tslTabsContent="settings" class="rounded-lg border p-4">Visibility, members and integrations.</div>
`;

export const Line: Story = {
  render: () => ({
    template: `
      <tsl-tabs tab="overview" class="max-w-xl">
        <tsl-tabs-list aria-label="Project sections">
          <button tslTabsTrigger="overview">Overview</button>
          <button tslTabsTrigger="activity">Activity</button>
          <button tslTabsTrigger="settings">Settings</button>
        </tsl-tabs-list>
        ${panels}
      </tsl-tabs>
    `,
  }),
};

export const Segmented: Story = {
  render: () => ({
    template: `
      <tsl-tabs tab="overview" class="max-w-xl">
        <tsl-tabs-list aria-label="Project sections" variant="segmented" class="w-full">
          <button tslTabsTrigger="overview">Overview</button>
          <button tslTabsTrigger="activity">Activity</button>
          <button tslTabsTrigger="settings">Settings</button>
        </tsl-tabs-list>
        ${panels}
      </tsl-tabs>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    props: { grid: LucideLayoutGrid, activity: LucideActivity, settings: LucideSettings },
    template: `
      <tsl-tabs tab="overview" class="max-w-xl">
        <tsl-tabs-list aria-label="Project sections">
          <button tslTabsTrigger="overview"><tsl-icon [icon]="grid" />Overview</button>
          <button tslTabsTrigger="activity"><tsl-icon [icon]="activity" />Activity</button>
          <button tslTabsTrigger="settings" disabled><tsl-icon [icon]="settings" />Settings</button>
        </tsl-tabs-list>
        ${panels}
      </tsl-tabs>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <tsl-tabs tab="overview" orientation="vertical" class="max-w-2xl">
        <tsl-tabs-list aria-label="Project sections">
          <button tslTabsTrigger="overview">Overview</button>
          <button tslTabsTrigger="activity">Activity</button>
          <button tslTabsTrigger="settings">Settings</button>
        </tsl-tabs-list>
        ${panels}
      </tsl-tabs>
    `,
  }),
};
