import { LucideSlidersHorizontal } from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { TslIcon } from '@tassili/ui/icon';
import { TslInput } from '@tassili/ui/input';
import { TslLabel } from '@tassili/ui/label';
import { TslPopoverImports } from './popover';

const meta: Meta = {
  title: 'Overlays/Popover',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [...TslPopoverImports, TslButton, TslIcon, TslInput, TslLabel] }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Floating content anchored to a button. Non-modal: the rest of the page stays usable, Escape or a click outside closes it, and focus returns to the trigger.

\`\`\`ts
import { TslPopoverImports } from '@tassili/ui/popover';
\`\`\`

- Give it a \`tslPopoverTitle\` (or \`aria-label\` on the content): it is announced as a dialog with that name.
- Use \`align\` (\`start\`, \`center\`, \`end\`) to line it up with the trigger.
- For plain text hints use a Tooltip; for actions in a list use a Dropdown menu.
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
      <tsl-popover>
        <button tslButton variant="outline" tslPopoverTrigger>Share</button>
        <tsl-popover-content *tslPopoverPortal="let ctx">
          <tsl-popover-header>
            <h3 tslPopoverTitle>Share this page</h3>
            <p tslPopoverDescription>Anyone with the link can view it.</p>
          </tsl-popover-header>
          <div class="flex gap-2">
            <input tslInput size="sm" aria-label="Link" value="https://tassili.dev/p/atlas" readonly />
            <button tslButton size="sm">Copy</button>
          </div>
        </tsl-popover-content>
      </tsl-popover>
    `,
  }),
};

export const QuickSettings: Story = {
  render: () => ({
    props: { icon: LucideSlidersHorizontal },
    template: `
      <tsl-popover align="end">
        <button tslButton variant="outline" size="icon" aria-label="Chart dimensions" tslPopoverTrigger>
          <tsl-icon [icon]="icon" />
        </button>
        <tsl-popover-content *tslPopoverPortal="let ctx" class="w-80">
          <tsl-popover-header>
            <h3 tslPopoverTitle>Dimensions</h3>
            <p tslPopoverDescription>Set the size of the chart.</p>
          </tsl-popover-header>
          <div class="grid gap-3">
            <div class="grid grid-cols-3 items-center gap-3">
              <label tslLabel for="width">Width</label>
              <input tslInput id="width" size="sm" value="100%" class="col-span-2" />
            </div>
            <div class="grid grid-cols-3 items-center gap-3">
              <label tslLabel for="height">Height</label>
              <input tslInput id="height" size="sm" value="320px" class="col-span-2" />
            </div>
          </div>
        </tsl-popover-content>
      </tsl-popover>
    `,
  }),
};
