import { LucideArchive, LucideCopy, LucideTrash2 } from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from '@tassili/ui/button';
import { TslIcon } from '@tassili/ui/icon';
import { TslTooltip } from './tooltip';

const meta: Meta = {
  title: 'Overlays/Tooltip',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslTooltip, TslButton, TslIcon] })],
  parameters: {
    docs: {
      description: {
        component: `
A short label shown on hover and keyboard focus.

\`\`\`ts
import { TslTooltip } from '@tassili/ui/tooltip';
\`\`\`

- Use it to name icon-only buttons or add a short hint. Keep it to a few words.
- Never put essential information or interactive content in a tooltip; touch users may never see it.
- Icon-only buttons still need \`aria-label\`; the tooltip is linked with \`aria-describedby\`.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const IconToolbar: Story = {
  render: () => ({
    props: { archive: LucideArchive, copy: LucideCopy, trash: LucideTrash2 },
    template: `
      <div class="flex gap-1">
        <button tslButton variant="ghost" size="icon" aria-label="Duplicate" tslTooltip="Duplicate"><tsl-icon [icon]="copy" /></button>
        <button tslButton variant="ghost" size="icon" aria-label="Archive" tslTooltip="Archive"><tsl-icon [icon]="archive" /></button>
        <button tslButton variant="ghost" size="icon" aria-label="Delete" tslTooltip="Delete"><tsl-icon [icon]="trash" /></button>
      </div>
    `,
  }),
};

export const Positions: Story = {
  render: () => ({
    template: `
      <div class="grid grid-cols-2 gap-3">
        @for (position of ['top', 'bottom', 'left', 'right']; track position) {
          <button tslButton variant="outline" [tslTooltip]="'Shown on the ' + position" [position]="position">{{ position }}</button>
        }
      </div>
    `,
  }),
};
