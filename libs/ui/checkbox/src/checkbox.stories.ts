import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslLabel } from '@tassili/ui/label';
import { TslCheckbox } from './checkbox';

const meta: Meta = {
  title: 'Primitives/Checkbox',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslCheckbox, TslLabel] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslCheckbox } from '@tassili/ui/checkbox';
\`\`\`

- Pair each checkbox with a \`tslLabel\` using \`inputId\` / \`for\`, or give it an \`aria-label\`.
- Use \`indeterminate\` for "select all" when only some items are selected.
- The visible box is 16px; the clickable area is 24px to meet WCAG 2.2 target size.
- For settings that apply immediately, use a Switch.
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
      <div class="flex items-center gap-2">
        <tsl-checkbox inputId="terms" />
        <label tslLabel for="terms">Accept the terms of service</label>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="grid gap-3">
        <div class="flex items-center gap-2"><tsl-checkbox inputId="c1" /><label tslLabel for="c1">Unchecked</label></div>
        <div class="flex items-center gap-2"><tsl-checkbox inputId="c2" [checked]="true" /><label tslLabel for="c2">Checked</label></div>
        <div class="flex items-center gap-2"><tsl-checkbox inputId="c3" [indeterminate]="true" /><label tslLabel for="c3">Indeterminate</label></div>
        <div class="group flex items-center gap-2" data-disabled="true"><tsl-checkbox inputId="c4" disabled /><label tslLabel for="c4">Disabled</label></div>
        <div class="flex items-center gap-2"><tsl-checkbox inputId="c5" forceInvalid /><label tslLabel for="c5">Invalid</label></div>
      </div>
    `,
  }),
};

export const WithDescription: Story = {
  render: () => ({
    template: `
      <div class="flex max-w-sm items-start gap-3">
        <tsl-checkbox inputId="digest" class="mt-0.5" aria-describedby="digest-hint" />
        <div class="grid gap-1.5">
          <label tslLabel for="digest">Weekly digest</label>
          <p id="digest-hint" class="text-sm text-muted-foreground">A summary of activity in your workspaces, every Monday.</p>
        </div>
      </div>
    `,
  }),
};
