import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslLabel } from '@tassili/ui/label';
import { TslSlider } from './slider';

const meta: Meta = {
  title: 'Primitives/Slider',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslSlider, TslLabel] })],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Choose a value or a range on a continuous scale. The value is an array with one entry per thumb.

\`\`\`ts
import { TslSlider } from '@tassili/ui/slider';
\`\`\`

- Name it with \`aria-label\` or \`aria-labelledby\`; each thumb is announced as a slider with its value.
- Keyboard: arrow keys move by \`step\`, Page Up/Down by ten steps, Home/End to the ends.
- Show the current value next to the slider when precision matters; dragging alone is hard to do accurately.
- Works in RTL: the scale starts on the right.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    props: { value: [40] },
    template: `
      <div class="grid max-w-sm gap-3">
        <div class="flex items-center justify-between">
          <span id="volume-label" class="text-sm font-medium">Volume</span>
          <span class="text-sm text-muted-foreground tabular-nums">{{ value[0] }}%</span>
        </div>
        <tsl-slider aria-labelledby="volume-label" [(value)]="value" />
      </div>
    `,
  }),
};

export const Range: Story = {
  render: () => ({
    props: { value: [120, 480] },
    template: `
      <div class="grid max-w-sm gap-3">
        <div class="flex items-center justify-between">
          <span id="price-label" class="text-sm font-medium">Price</span>
          <span class="text-sm text-muted-foreground tabular-nums" dir="ltr">\${{ value[0] }} – \${{ value[1] }}</span>
        </div>
        <tsl-slider aria-labelledby="price-label" [(value)]="value" [min]="0" [max]="600" [step]="10" [minStepsBetweenThumbs]="5" />
      </div>
    `,
  }),
};

export const WithTicks: Story = {
  render: () => ({
    template: `
      <div class="max-w-sm">
        <tsl-slider aria-label="Rating" [value]="[3]" [min]="1" [max]="5" [step]="1" showTicks />
      </div>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <div class="flex h-48 gap-8">
        <tsl-slider aria-label="Bass" orientation="vertical" [value]="[60]" />
        <tsl-slider aria-label="Treble" orientation="vertical" [value]="[30]" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<div class="max-w-sm"><tsl-slider aria-label="Locked" [value]="[50]" [disabled]="true" /></div>`,
  }),
};
