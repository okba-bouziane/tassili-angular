import {
  LucideCalendar,
  LucideChartColumn,
  LucideFolderKanban,
  LucideInbox,
  LucideLayoutDashboard,
  LucideSettings,
  LucideUsers,
} from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslAvatar } from '@tassili/ui/avatar';
import { TslIcon } from '@tassili/ui/icon';
import { TslSeparator } from '@tassili/ui/separator';
import { TslSidebarImports } from './sidebar';

const meta: Meta = {
  title: 'Navigation/Sidebar',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [...TslSidebarImports, TslIcon, TslAvatar, TslSeparator] }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
App navigation in a side column. On desktop it collapses to an icon rail (Ctrl/⌘+B, remembered); below 768px it becomes an off-canvas panel with a backdrop, a focus trap and Escape to close.

\`\`\`ts
import { TslSidebarImports } from '@tassili/ui/sidebar';
\`\`\`

- Wrap the layout in \`tsl-sidebar-provider\`; put page content in \`tsl-sidebar-inset\`.
- Put each label in a \`<span>\` after the icon: it becomes screen-reader-only in the rail, and \`tooltip\` shows it on hover.
- Bind \`[active]\` (e.g. from \`routerLinkActive\`) to mark the current page with Tassili's indigo marker and \`aria-current\`.
- Add \`tslSidebarCloseOnNavigate\` to links so the mobile panel closes after navigating.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const icons = {
  dashboard: LucideLayoutDashboard,
  inbox: LucideInbox,
  projects: LucideFolderKanban,
  calendar: LucideCalendar,
  reports: LucideChartColumn,
  team: LucideUsers,
  settings: LucideSettings,
};

export const AppLayout: Story = {
  render: () => ({
    props: { icons },
    template: `
      <tsl-sidebar-provider [storageKey]="null">
        <tsl-sidebar label="Main navigation">
          <tsl-sidebar-header>
            <div class="flex h-10 items-center gap-2 px-2 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand font-display text-sm font-bold text-brand-foreground">T</span>
              <span class="font-display text-base font-semibold tracking-tight group-data-[state=collapsed]/sidebar:sr-only">Tassili</span>
            </div>
          </tsl-sidebar-header>
          <tsl-sidebar-content>
            <tsl-sidebar-group>
              <tsl-sidebar-group-label>Workspace</tsl-sidebar-group-label>
              <ul tslSidebarMenu>
                <li tslSidebarMenuItem><a tslSidebarMenuButton href="#" [active]="true" tooltip="Dashboard" tslSidebarCloseOnNavigate><tsl-icon [icon]="icons.dashboard" /><span>Dashboard</span></a></li>
                <li tslSidebarMenuItem>
                  <a tslSidebarMenuButton href="#" tooltip="Inbox" tslSidebarCloseOnNavigate><tsl-icon [icon]="icons.inbox" /><span>Inbox</span></a>
                  <tsl-sidebar-menu-badge>8</tsl-sidebar-menu-badge>
                </li>
                <li tslSidebarMenuItem><a tslSidebarMenuButton href="#" tooltip="Projects" tslSidebarCloseOnNavigate><tsl-icon [icon]="icons.projects" /><span>Projects</span></a></li>
                <li tslSidebarMenuItem><a tslSidebarMenuButton href="#" tooltip="Calendar" tslSidebarCloseOnNavigate><tsl-icon [icon]="icons.calendar" /><span>Calendar</span></a></li>
              </ul>
            </tsl-sidebar-group>
            <tsl-sidebar-group>
              <tsl-sidebar-group-label>Insights</tsl-sidebar-group-label>
              <ul tslSidebarMenu>
                <li tslSidebarMenuItem><a tslSidebarMenuButton href="#" tooltip="Reports"><tsl-icon [icon]="icons.reports" /><span>Reports</span></a></li>
                <li tslSidebarMenuItem><a tslSidebarMenuButton href="#" tooltip="Team"><tsl-icon [icon]="icons.team" /><span>Team</span></a></li>
              </ul>
            </tsl-sidebar-group>
          </tsl-sidebar-content>
          <tsl-sidebar-footer>
            <ul tslSidebarMenu>
              <li tslSidebarMenuItem><a tslSidebarMenuButton href="#" tooltip="Settings"><tsl-icon [icon]="icons.settings" /><span>Settings</span></a></li>
            </ul>
            <tsl-sidebar-separator />
            <div class="flex items-center gap-2 px-1 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0">
              <tsl-avatar name="Okba Bouziane" size="sm" decorative />
              <div class="grid min-w-0 text-sm group-data-[state=collapsed]/sidebar:sr-only">
                <span class="truncate font-medium">Okba Bouziane</span>
                <span class="truncate text-xs text-muted-foreground">okba&#64;tassili.dev</span>
              </div>
            </div>
          </tsl-sidebar-footer>
        </tsl-sidebar>
        <tsl-sidebar-inset>
          <header class="flex h-(--tsl-header-height) items-center gap-2 border-b px-3">
            <tsl-sidebar-trigger />
            <tsl-separator orientation="vertical" class="h-4" />
            <h1 class="text-sm font-medium">Dashboard</h1>
          </header>
          <main class="grid gap-4 p-6">
            <p class="max-w-prose text-sm text-muted-foreground">Toggle the sidebar with the button or Ctrl/⌘+B. Resize below 768px to see the mobile panel.</p>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="h-28 rounded-lg border bg-card"></div>
              <div class="h-28 rounded-lg border bg-card"></div>
              <div class="h-28 rounded-lg border bg-card"></div>
            </div>
          </main>
        </tsl-sidebar-inset>
      </tsl-sidebar-provider>
    `,
  }),
};
