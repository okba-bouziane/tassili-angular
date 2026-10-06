import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslDropdownMenuImports } from '@tassili/ui/dropdown-menu';
import { TslContextMenuTrigger } from './context-menu';

const meta: Meta = {
  title: 'Overlays/Context menu',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslContextMenuTrigger, ...TslDropdownMenuImports] })],
  parameters: {
    docs: {
      description: {
        component: `
Opens a menu at the pointer on right-click (or the Menu key / Shift+F10 when the area is focused). The menu is a regular dropdown menu.

\`\`\`ts
import { TslContextMenuTrigger } from '@tassili/ui/context-menu';
import { TslDropdownMenuImports } from '@tassili/ui/dropdown-menu';
\`\`\`

Context menus are invisible until used: every action in one must also be reachable from visible controls.
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
      <div
        [tslContextMenuTrigger]="menu"
        tabindex="0"
        class="flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
      >
        Right-click here
      </div>
      <ng-template #menu>
        <tsl-dropdown-menu class="w-48">
          <button tslDropdownMenuItem>Open<tsl-dropdown-menu-shortcut>↵</tsl-dropdown-menu-shortcut></button>
          <button tslDropdownMenuItem>Rename<tsl-dropdown-menu-shortcut>F2</tsl-dropdown-menu-shortcut></button>
          <button tslDropdownMenuItem>Duplicate</button>
          <tsl-dropdown-menu-separator />
          <button tslDropdownMenuItem variant="destructive">Move to trash</button>
        </tsl-dropdown-menu>
      </ng-template>
    `,
  }),
};
