import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslAvatar, TslAvatarGroup } from './avatar';

const meta: Meta = {
  title: 'Primitives/Avatar',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslAvatar, TslAvatarGroup] })],
  parameters: {
    docs: {
      description: {
        component: `
\`\`\`ts
import { TslAvatar, TslAvatarGroup } from '@tassili/ui/avatar';
\`\`\`

Shows a picture, or the person's initials while it loads or if it fails. Set \`decorative\` when the name is visible right next to the avatar, so screen readers don't hear it twice.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ImageAndFallback: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <tsl-avatar name="Okba Bouziane" src="assets/portrait.svg" />
        <tsl-avatar name="Okba Bouziane" />
        <tsl-avatar name="Amina Haddad" src="assets/does-not-exist.jpg" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-end gap-3">
        @for (size of ['xs', 'sm', 'md', 'lg', 'xl']; track size) {
          <tsl-avatar name="Okba Bouziane" [size]="size" />
        }
      </div>
    `,
  }),
};

export const Square: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <tsl-avatar name="Atlas Studio" shape="square" />
        <tsl-avatar name="Sahara Labs" shape="square" src="assets/portrait.svg" />
      </div>
    `,
  }),
};

export const WithName: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <tsl-avatar name="Okba Bouziane" src="assets/portrait.svg" decorative />
        <div class="grid">
          <span class="text-sm font-medium">Okba Bouziane</span>
          <span class="text-sm text-muted-foreground">okba&#64;tassili.dev</span>
        </div>
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <tsl-avatar-group>
        <tsl-avatar name="Okba Bouziane" src="assets/portrait.svg" size="sm" />
        <tsl-avatar name="Amina Haddad" size="sm" />
        <tsl-avatar name="Yacine Meziane" size="sm" />
        <tsl-avatar name="Lina Saadi" size="sm" />
      </tsl-avatar-group>
    `,
  }),
};
