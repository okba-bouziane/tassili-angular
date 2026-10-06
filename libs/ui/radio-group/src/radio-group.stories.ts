import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslRadio, TslRadioGroup } from './radio-group';

const meta: Meta = {
  title: 'Primitives/Radio group',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslRadioGroup, TslRadio] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslRadio, TslRadioGroup } from '@tassili/ui/radio-group';
\`\`\`

- Use for 2–5 mutually exclusive options that should all stay visible; use a Select for longer lists.
- Give the group an accessible name (\`aria-label\` or \`aria-labelledby\` pointing at a heading).
- Tab moves into the group, arrow keys move between options.
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
      <div class="grid gap-3">
        <p id="plan-label" class="text-sm font-medium">Plan</p>
        <div tslRadioGroup aria-labelledby="plan-label" value="pro">
          <tsl-radio value="free">Free</tsl-radio>
          <tsl-radio value="pro">Pro</tsl-radio>
          <tsl-radio value="team">Team</tsl-radio>
        </div>
      </div>
    `,
  }),
};

export const WithDescriptions: Story = {
  render: () => ({
    template: `
      <div tslRadioGroup aria-label="Billing cycle" value="yearly" class="max-w-sm">
        <tsl-radio value="monthly" class="items-start rounded-lg border p-3">
          <span class="grid gap-1"><span class="font-medium">Monthly</span><span class="text-muted-foreground">$12 per seat, cancel any time.</span></span>
        </tsl-radio>
        <tsl-radio value="yearly" class="items-start rounded-lg border p-3">
          <span class="grid gap-1"><span class="font-medium">Yearly</span><span class="text-muted-foreground">$120 per seat, two months free.</span></span>
        </tsl-radio>
      </div>
    `,
  }),
};

export const Horizontal: Story = {
  render: () => ({
    template: `
      <div tslRadioGroup aria-label="Density" value="compact" class="flex gap-6">
        <tsl-radio value="compact">Compact</tsl-radio>
        <tsl-radio value="comfortable">Comfortable</tsl-radio>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div tslRadioGroup aria-label="Region" value="eu" [disabled]="true">
        <tsl-radio value="eu">Europe</tsl-radio>
        <tsl-radio value="africa">Africa</tsl-radio>
      </div>
    `,
  }),
};
