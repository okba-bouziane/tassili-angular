import {
  LucideCreditCard,
  LucideEllipsis,
  LucideLogOut,
  LucideSettings,
  LucideUser,
  LucideUserPlus,
} from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { TslIcon } from '@tassili/ui/icon';
import { TslDropdownMenuImports } from './dropdown-menu';

const meta: Meta = {
  title: 'Overlays/Dropdown menu',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...TslDropdownMenuImports, TslButton, TslIcon] })],
  parameters: {
    docs: {
      description: {
        component: `
A list of actions or options that opens from a button. Built on Angular CDK menus: arrow keys, type-ahead, Enter/Space, Escape, and submenus with Right/Left (mirrored in RTL).

\`\`\`ts
import { TslDropdownMenuImports } from '@tassili/ui/dropdown-menu';
\`\`\`

- Put the menu in an \`<ng-template>\` and pass it to \`[tslDropdownMenuTrigger]\`.
- Use \`tslDropdownMenuCheckbox\` for toggles and \`tslDropdownMenuRadio\` inside a group for exclusive choices; both keep the menu open.
- Mark destructive actions with \`variant="destructive"\` and confirm them in an alert dialog.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Account: Story = {
  render: () => ({
    props: {
      user: LucideUser,
      card: LucideCreditCard,
      settings: LucideSettings,
      inviteIcon: LucideUserPlus,
      logout: LucideLogOut,
    },
    template: `
      <button tslButton variant="outline" [tslDropdownMenuTrigger]="menu">My account</button>
      <ng-template #menu>
        <tsl-dropdown-menu class="w-56">
          <tsl-dropdown-menu-label>okba&#64;tassili.dev</tsl-dropdown-menu-label>
          <tsl-dropdown-menu-group>
            <button tslDropdownMenuItem><tsl-icon [icon]="user" />Profile<tsl-dropdown-menu-shortcut>⇧⌘P</tsl-dropdown-menu-shortcut></button>
            <button tslDropdownMenuItem><tsl-icon [icon]="card" />Billing<tsl-dropdown-menu-shortcut>⌘B</tsl-dropdown-menu-shortcut></button>
            <button tslDropdownMenuItem><tsl-icon [icon]="settings" />Settings<tsl-dropdown-menu-shortcut>⌘,</tsl-dropdown-menu-shortcut></button>
          </tsl-dropdown-menu-group>
          <tsl-dropdown-menu-separator />
          <button tslDropdownMenuItem [tslDropdownMenuSubTrigger]="invite">
            <tsl-icon [icon]="inviteIcon" />Invite people<tsl-dropdown-menu-sub-indicator />
          </button>
          <button tslDropdownMenuItem disabled>API keys</button>
          <tsl-dropdown-menu-separator />
          <button tslDropdownMenuItem variant="destructive"><tsl-icon [icon]="logout" />Sign out</button>
        </tsl-dropdown-menu>
      </ng-template>
      <ng-template #invite>
        <tsl-dropdown-menu-sub>
          <button tslDropdownMenuItem>By email</button>
          <button tslDropdownMenuItem>By link</button>
        </tsl-dropdown-menu-sub>
      </ng-template>
    `,
  }),
};

export const CheckboxesAndRadios: Story = {
  render: () => ({
    props: { more: LucideEllipsis },
    template: `
      <button tslButton variant="outline" size="icon" aria-label="View options" [tslDropdownMenuTrigger]="menu">
        <tsl-icon [icon]="more" />
      </button>
      <ng-template #menu>
        <tsl-dropdown-menu class="w-52">
          <tsl-dropdown-menu-label inset>Show</tsl-dropdown-menu-label>
          <button tslDropdownMenuCheckbox [checked]="true">Status bar</button>
          <button tslDropdownMenuCheckbox>Activity panel</button>
          <tsl-dropdown-menu-separator />
          <tsl-dropdown-menu-label inset>Density</tsl-dropdown-menu-label>
          <tsl-dropdown-menu-group>
            <button tslDropdownMenuRadio [checked]="true">Compact</button>
            <button tslDropdownMenuRadio>Comfortable</button>
          </tsl-dropdown-menu-group>
        </tsl-dropdown-menu>
      </ng-template>
    `,
  }),
};
