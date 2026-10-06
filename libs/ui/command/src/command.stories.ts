import {
  LucideCalendar,
  LucideCreditCard,
  LucideFolderKanban,
  LucideLayoutDashboard,
  LucideSettings,
  LucideUser,
} from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { TslIcon } from '@tassili/ui/icon';
import { TslCommandImports } from './command';

const meta: Meta = {
  title: 'Overlays/Command palette',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...TslCommandImports, TslButton, TslIcon] })],
  parameters: {
    docs: {
      description: {
        component: `
A searchable list of pages and actions, inline or in a dialog. Typing filters, arrow keys move, Enter runs the highlighted command.

\`\`\`ts
import { TslCommandImports } from '@tassili/ui/command';
\`\`\`

- Each \`tslCommandItem\` needs a \`value\` (what search matches) and a \`(selected)\` handler.
- \`tsl-command-dialog hotkey="k"\` opens the palette with ⌘K / Ctrl+K from anywhere. Also offer a visible button that opens it.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const icons = {
  dashboard: LucideLayoutDashboard,
  projects: LucideFolderKanban,
  calendar: LucideCalendar,
  profile: LucideUser,
  billing: LucideCreditCard,
  settings: LucideSettings,
};

const body = `
  <tsl-command>
    <tsl-command-input placeholder="Search pages and actions" />
    <tsl-command-list>
      <div *tslCommandEmptyState tslCommandEmpty>No results. Try another word.</div>
      <tsl-command-group>
        <tsl-command-group-label>Go to</tsl-command-group-label>
        <button tslCommandItem value="Dashboard"><tsl-icon [icon]="icons.dashboard" />Dashboard</button>
        <button tslCommandItem value="Projects"><tsl-icon [icon]="icons.projects" />Projects</button>
        <button tslCommandItem value="Calendar"><tsl-icon [icon]="icons.calendar" />Calendar</button>
      </tsl-command-group>
      <tsl-command-separator />
      <tsl-command-group>
        <tsl-command-group-label>Account</tsl-command-group-label>
        <button tslCommandItem value="Profile"><tsl-icon [icon]="icons.profile" />Profile<tsl-command-shortcut>⌘P</tsl-command-shortcut></button>
        <button tslCommandItem value="Billing"><tsl-icon [icon]="icons.billing" />Billing<tsl-command-shortcut>⌘B</tsl-command-shortcut></button>
        <button tslCommandItem value="Settings"><tsl-icon [icon]="icons.settings" />Settings<tsl-command-shortcut>⌘,</tsl-command-shortcut></button>
      </tsl-command-group>
    </tsl-command-list>
  </tsl-command>
`;

export const Inline: Story = {
  render: () => ({
    props: { icons },
    template: `<div class="w-96 rounded-xl border shadow-md">${body}</div>`,
  }),
};

export const InDialog: Story = {
  render: () => ({
    props: { icons },
    template: `
      <div class="flex items-center gap-3 text-sm text-muted-foreground">
        <button tslButton variant="outline" (click)="palette.open()">Search…</button>
        <span>or press <kbd class="rounded-sm border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd></span>
      </div>
      <tsl-command-dialog #palette hotkey="k">${body}</tsl-command-dialog>
    `,
  }),
};
