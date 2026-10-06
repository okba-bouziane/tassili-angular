import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslLabel } from '@tassili/ui/label';
import { TslSwitch } from './switch';

const meta: Meta = {
  title: 'Primitives/Switch',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslSwitch, TslLabel] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslSwitch } from '@tassili/ui/switch';
\`\`\`

Use a switch for settings that take effect immediately. Label it with what the setting turns on, not with "On/Off". Switch the Direction toolbar to RTL to see the thumb mirror.
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
      <div class="flex items-center gap-3">
        <tsl-switch inputId="notifications" [checked]="true" />
        <label tslLabel for="notifications">Email notifications</label>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="grid gap-3">
        <div class="flex items-center gap-3"><tsl-switch inputId="s1" size="sm" [checked]="true" /><label tslLabel for="s1">Small</label></div>
        <div class="flex items-center gap-3"><tsl-switch inputId="s2" [checked]="true" /><label tslLabel for="s2">Medium</label></div>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="grid gap-3">
        <div class="flex items-center gap-3"><tsl-switch inputId="t1" /><label tslLabel for="t1">Off</label></div>
        <div class="flex items-center gap-3"><tsl-switch inputId="t2" [checked]="true" /><label tslLabel for="t2">On</label></div>
        <div class="flex items-center gap-3"><tsl-switch inputId="t3" disabled /><label tslLabel for="t3">Disabled</label></div>
        <div class="flex items-center gap-3"><tsl-switch inputId="t4" forceInvalid /><label tslLabel for="t4">Invalid</label></div>
      </div>
    `,
  }),
};

export const SettingsRow: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div class="flex max-w-md items-center justify-between gap-6 rounded-lg border p-4">
        <div class="grid gap-1">
          <label tslLabel for="sync">Sync across devices</label>
          <p class="text-sm text-muted-foreground">Keep your theme and layout the same everywhere you sign in.</p>
        </div>
        <tsl-switch inputId="sync" [checked]="true" />
      </div>
    `,
  }),
};
