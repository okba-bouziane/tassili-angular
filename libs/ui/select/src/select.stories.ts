import { LucideGlobe } from '@lucide/angular';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslIcon } from '@tassili/ui/icon';
import { TslLabel } from '@tassili/ui/label';
import { TslSelectImports } from './select';

const timezones: Record<string, string> = {
  'Africa/Algiers': 'Algiers (UTC+1)',
  'Africa/Casablanca': 'Casablanca (UTC+1)',
  'Europe/Paris': 'Paris (UTC+2)',
  'Europe/London': 'London (UTC+1)',
  'America/New_York': 'New York (UTC−4)',
};

const meta: Meta = {
  title: 'Primitives/Select',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...TslSelectImports, TslLabel, TslIcon] })],
  parameters: {
    docs: {
      description: {
        component: `
Pick one option from a list. Built on a button trigger and a listbox popup, with full keyboard support (arrow keys, Home/End, type-ahead, Enter, Escape).

\`\`\`ts
import { TslSelectImports } from '@tassili/ui/select';
\`\`\`

- Label the trigger with \`tslLabel\` (\`for\` = \`buttonId\`) or \`aria-label\`.
- When a value is set before the list is first opened, pass \`[itemToString]\` so the trigger can show its label.
- Use a Radio group for 2–5 options that should stay visible, and a Combobox when people need to search.
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
      <div class="grid w-64 gap-2">
        <label tslLabel for="role-trigger">Role</label>
        <tsl-select>
          <tsl-select-trigger buttonId="role-trigger">
            <tsl-select-value placeholder="Choose a role" />
          </tsl-select-trigger>
          <tsl-select-content *tslSelectPortal>
            <tsl-select-item value="owner">Owner</tsl-select-item>
            <tsl-select-item value="admin">Admin</tsl-select-item>
            <tsl-select-item value="member">Member</tsl-select-item>
            <tsl-select-item value="guest" [disabled]="true">Guest</tsl-select-item>
          </tsl-select-content>
        </tsl-select>
      </div>
    `,
  }),
};

export const GroupedWithPreselectedValue: Story = {
  render: () => ({
    props: { timezones, label: (value: string) => timezones[value] ?? value },
    template: `
      <div class="grid w-72 gap-2">
        <label tslLabel for="tz-trigger">Time zone</label>
        <tsl-select value="Africa/Algiers" [itemToString]="label">
          <tsl-select-trigger buttonId="tz-trigger">
            <tsl-select-value />
          </tsl-select-trigger>
          <tsl-select-content *tslSelectPortal>
            <tsl-select-group>
              <tsl-select-label>Africa</tsl-select-label>
              <tsl-select-item value="Africa/Algiers">{{ timezones['Africa/Algiers'] }}</tsl-select-item>
              <tsl-select-item value="Africa/Casablanca">{{ timezones['Africa/Casablanca'] }}</tsl-select-item>
            </tsl-select-group>
            <tsl-select-separator />
            <tsl-select-group>
              <tsl-select-label>Europe</tsl-select-label>
              <tsl-select-item value="Europe/Paris">{{ timezones['Europe/Paris'] }}</tsl-select-item>
              <tsl-select-item value="Europe/London">{{ timezones['Europe/London'] }}</tsl-select-item>
            </tsl-select-group>
            <tsl-select-separator />
            <tsl-select-group>
              <tsl-select-label>Americas</tsl-select-label>
              <tsl-select-item value="America/New_York">{{ timezones['America/New_York'] }}</tsl-select-item>
            </tsl-select-group>
          </tsl-select-content>
        </tsl-select>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="grid w-56 gap-3">
        @for (size of ['sm', 'md', 'lg']; track size) {
          <tsl-select>
            <tsl-select-trigger [size]="size" [attr.aria-label]="'Size ' + size">
              <tsl-select-value [placeholder]="'Size ' + size" />
            </tsl-select-trigger>
            <tsl-select-content *tslSelectPortal>
              <tsl-select-item value="a">Option A</tsl-select-item>
              <tsl-select-item value="b">Option B</tsl-select-item>
            </tsl-select-content>
          </tsl-select>
        }
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    props: { globe: LucideGlobe },
    template: `
      <tsl-select>
        <tsl-select-trigger class="w-48" aria-label="Language">
          <tsl-icon [icon]="globe" class="text-muted-foreground" />
          <tsl-select-value placeholder="Language" />
        </tsl-select-trigger>
        <tsl-select-content *tslSelectPortal>
          <tsl-select-item value="en">English</tsl-select-item>
          <tsl-select-item value="fr">Français</tsl-select-item>
          <tsl-select-item value="ar">العربية</tsl-select-item>
        </tsl-select-content>
      </tsl-select>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="grid w-56 gap-3">
        <tsl-select [disabled]="true">
          <tsl-select-trigger aria-label="Disabled"><tsl-select-value placeholder="Disabled" /></tsl-select-trigger>
          <tsl-select-content *tslSelectPortal><tsl-select-item value="a">A</tsl-select-item></tsl-select-content>
        </tsl-select>
        <tsl-select>
          <tsl-select-trigger aria-label="Invalid" forceInvalid><tsl-select-value placeholder="Invalid" /></tsl-select-trigger>
          <tsl-select-content *tslSelectPortal><tsl-select-item value="a">A</tsl-select-item></tsl-select-content>
        </tsl-select>
      </div>
    `,
  }),
};
