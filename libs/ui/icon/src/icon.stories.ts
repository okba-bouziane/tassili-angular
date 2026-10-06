import {
  LucideArrowRight,
  LucideBell,
  LucideChevronRight,
  LucideCircleAlert,
  LucideSearch,
  LucideSettings,
} from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslIcon, type TslIconSize } from './icon';

interface IconArgs {
  size: TslIconSize;
  strokeWidth: number;
  label: string;
}

const meta: Meta<IconArgs> = {
  title: 'Primitives/Icon',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslIcon] })],
  parameters: {
    docs: {
      description: {
        component: `
Lucide icons on the Tassili size scale with a 1.75 stroke.

\`\`\`ts
import { TslIcon } from '@tassili/ui/icon';
import { LucideSearch } from '@lucide/angular';
\`\`\`

- Icons are **decorative by default** (\`aria-hidden\`). Add \`label\` only when the icon carries meaning that isn't in nearby text.
- Inside an icon-only button, put the \`aria-label\` on the button, not the icon.
- Set \`mirrorInRtl\` on icons that point in the reading direction (arrows, chevrons), not on icons such as a clock or a search glass.
- Color follows \`currentColor\`: \`<tsl-icon class="text-muted-foreground" …/>\`.
`,
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    strokeWidth: { control: { type: 'range', min: 1, max: 3, step: 0.25 } },
    label: { control: 'text' },
  },
  args: { size: 'lg', strokeWidth: 1.75, label: '' },
  render: (args) => ({
    props: { ...args, icon: LucideSettings },
    template: `<tsl-icon [icon]="icon" [size]="size" [strokeWidth]="strokeWidth" [label]="label" />`,
  }),
};

export default meta;
type Story = StoryObj<IconArgs>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    props: { icon: LucideBell },
    template: `
      <div class="flex items-end gap-4 text-foreground">
        @for (size of ['xs', 'sm', 'md', 'lg', 'xl']; track size) {
          <div class="flex flex-col items-center gap-2">
            <tsl-icon [icon]="icon" [size]="size" />
            <code class="text-xs text-muted-foreground">{{ size }}</code>
          </div>
        }
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    props: { icon: LucideCircleAlert },
    template: `
      <div class="flex items-center gap-4">
        <tsl-icon [icon]="icon" size="lg" class="text-foreground" />
        <tsl-icon [icon]="icon" size="lg" class="text-muted-foreground" />
        <tsl-icon [icon]="icon" size="lg" class="text-primary" />
        <tsl-icon [icon]="icon" size="lg" class="text-destructive" />
        <tsl-icon [icon]="icon" size="lg" class="text-success" />
      </div>
    `,
  }),
};

export const MirroredInRtl: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Switch the Direction toolbar to RTL: the arrow and chevron flip, the search glass does not.',
      },
    },
  },
  render: () => ({
    props: { arrow: LucideArrowRight, chevron: LucideChevronRight, search: LucideSearch },
    template: `
      <div class="flex items-center gap-4 text-foreground">
        <tsl-icon [icon]="arrow" size="lg" mirrorInRtl />
        <tsl-icon [icon]="chevron" size="lg" mirrorInRtl />
        <tsl-icon [icon]="search" size="lg" />
      </div>
    `,
  }),
};

export const Labelled: Story = {
  render: () => ({
    props: { icon: LucideCircleAlert },
    template: `<tsl-icon [icon]="icon" size="lg" label="Warning" class="text-destructive" />`,
  }),
};
