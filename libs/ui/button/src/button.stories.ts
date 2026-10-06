import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslButton } from './button';

interface ButtonArgs {
  variant: TslButton['variant'] extends () => infer V ? V : never;
  size: TslButton['size'] extends () => infer S ? S : never;
  disabled: boolean;
  label: string;
}

const meta: Meta<ButtonArgs> = {
  title: 'Primitives/Button',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TslButton] })],
  parameters: {
    docs: {
      description: {
        component: `
Apply \`tslButton\` to a native \`<button>\` or \`<a>\`, so browsers and assistive tech get real button and link semantics.

\`\`\`ts
import { TslButton } from '@tassili/ui/button';
\`\`\`

- Use **one \`primary\` button per view** for the main action; use \`secondary\`, \`outline\` or \`ghost\` for the rest.
- \`destructive\` is for irreversible actions; pair it with a confirmation.
- Buttons default to \`type="button"\`; set \`type="submit"\` explicitly in forms.
- Icon-only buttons (\`size="icon"\`) need an \`aria-label\`.
- Labels are verbs in sentence case: "Save changes", not "OK".
`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { variant: 'primary', size: 'md', disabled: false, label: 'Save changes' },
  render: ({ label, ...args }) => ({
    props: { ...args, label },
    template: `<button tslButton ${argsToTemplate(args)}>{{ label }}</button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <button tslButton>Primary</button>
        <button tslButton variant="secondary">Secondary</button>
        <button tslButton variant="outline">Outline</button>
        <button tslButton variant="ghost">Ghost</button>
        <button tslButton variant="destructive">Delete project</button>
        <a tslButton variant="link" href="#">Read the docs</a>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <button tslButton size="sm">Small</button>
        <button tslButton size="md">Medium</button>
        <button tslButton size="lg">Large</button>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <button tslButton variant="outline" size="icon-sm" aria-label="Previous">‹</button>
        <button tslButton variant="outline" size="icon" aria-label="Next">›</button>
        <button tslButton size="icon-lg" aria-label="Add">+</button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <button tslButton disabled>Primary</button>
        <button tslButton variant="outline" disabled>Outline</button>
        <a tslButton variant="secondary" href="#" [disabled]="true">Disabled link</a>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  render: () => ({
    template: `<a tslButton variant="outline" href="#">Open dashboard</a>`,
  }),
};

export const FullWidth: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `<div class="max-w-sm"><button tslButton class="w-full">Continue</button></div>`,
  }),
};
