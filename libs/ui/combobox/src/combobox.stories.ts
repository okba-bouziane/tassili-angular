import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TslLabel } from '@tassili/ui/label';
import { TslComboboxImports } from './combobox';

interface Country {
  code: string;
  name: string;
  region: 'Africa' | 'Europe' | 'Asia';
}

const countries: Country[] = [
  { code: 'DZ', name: 'Algeria', region: 'Africa' },
  { code: 'EG', name: 'Egypt', region: 'Africa' },
  { code: 'MA', name: 'Morocco', region: 'Africa' },
  { code: 'TN', name: 'Tunisia', region: 'Africa' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'JP', name: 'Japan', region: 'Asia' },
  { code: 'IN', name: 'India', region: 'Asia' },
];
const regions = ['Africa', 'Europe', 'Asia'] as const;
const skills = [
  'Angular',
  'TypeScript',
  'RxJS',
  'Signals',
  'Tailwind CSS',
  'Accessibility',
  'Testing',
];

const meta: Meta = {
  title: 'Primitives/Combobox',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...TslComboboxImports, TslLabel] })],
  parameters: {
    docs: {
      description: {
        component: `
A text field that filters a list of options as people type. Supports single and multiple values, groups, an empty state and a clear button.

\`\`\`ts
import { TslComboboxImports } from '@tassili/ui/combobox';
\`\`\`

- For object values, pass \`[itemToString]\` so typing filters by label and the field shows it.
- Use \`tsl-combobox-trigger\` with a search input inside the content when the field should look like a select.
- In multiple mode, Backspace in an empty input removes the last chip.
`,
      },
    },
  },
  args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    props: { countries, toName: (country: Country) => country.name },
    template: `
      <div class="grid w-72 gap-2">
        <label tslLabel for="country">Country</label>
        <tsl-combobox [itemToString]="toName">
          <tsl-combobox-input inputId="country" placeholder="Search countries" showClear />
          <tsl-combobox-content *tslComboboxPortal>
            <tsl-combobox-empty>No countries match.</tsl-combobox-empty>
            <div tslComboboxList>
              @for (country of countries; track country.code) {
                <tsl-combobox-item [value]="country">{{ country.name }}</tsl-combobox-item>
              }
            </div>
          </tsl-combobox-content>
        </tsl-combobox>
      </div>
    `,
  }),
};

export const Grouped: Story = {
  render: () => ({
    props: {
      regions,
      toName: (country: Country) => country.name,
      inRegion: (region: string) => countries.filter((country) => country.region === region),
    },
    template: `
      <tsl-combobox [itemToString]="toName" class="w-72">
        <tsl-combobox-input aria-label="Country" placeholder="Search countries" />
        <tsl-combobox-content *tslComboboxPortal>
          <tsl-combobox-empty>No countries match.</tsl-combobox-empty>
          <div tslComboboxList>
            @for (region of regions; track region; let last = $last) {
              <tsl-combobox-group>
                <tsl-combobox-label>{{ region }}</tsl-combobox-label>
                @for (country of inRegion(region); track country.code) {
                  <tsl-combobox-item [value]="country">{{ country.name }}</tsl-combobox-item>
                }
              </tsl-combobox-group>
              @if (!last) {
                <tsl-combobox-separator />
              }
            }
          </div>
        </tsl-combobox-content>
      </tsl-combobox>
    `,
  }),
};

export const ButtonTrigger: Story = {
  render: () => ({
    props: { countries, toName: (country: Country) => country.name },
    template: `
      <div class="grid w-64 gap-2">
        <label tslLabel for="ship-to">Ship to</label>
        <tsl-combobox [itemToString]="toName">
          <tsl-combobox-trigger buttonId="ship-to">
            <tsl-combobox-value placeholder="Choose a country" />
          </tsl-combobox-trigger>
          <tsl-combobox-content *tslComboboxPortal>
            <tsl-combobox-input aria-label="Search countries" placeholder="Search" [showTrigger]="false" />
            <tsl-combobox-empty>No countries match.</tsl-combobox-empty>
            <div tslComboboxList>
              @for (country of countries; track country.code) {
                <tsl-combobox-item [value]="country">{{ country.name }}</tsl-combobox-item>
              }
            </div>
          </tsl-combobox-content>
        </tsl-combobox>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    props: { skills, selected: ['Angular', 'Signals'] },
    template: `
      <div class="grid w-80 gap-2">
        <label tslLabel for="skills">Skills</label>
        <tsl-combobox-multiple [value]="selected">
          <tsl-combobox-chips>
            <ng-template tslComboboxValues let-values>
              @for (value of values; track value) {
                <tsl-combobox-chip [value]="value" [removeLabel]="'Remove ' + value">{{ value }}</tsl-combobox-chip>
              }
            </ng-template>
            <input tslComboboxChipInput id="skills" placeholder="Add a skill" />
          </tsl-combobox-chips>
          <tsl-combobox-content *tslComboboxPortal>
            <tsl-combobox-empty>No skills match.</tsl-combobox-empty>
            <div tslComboboxList>
              @for (skill of skills; track skill) {
                <tsl-combobox-item [value]="skill">{{ skill }}</tsl-combobox-item>
              }
            </div>
          </tsl-combobox-content>
        </tsl-combobox-multiple>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    props: { skills },
    template: `
      <div class="grid w-72 gap-3">
        <tsl-combobox [disabled]="true">
          <tsl-combobox-input aria-label="Disabled" placeholder="Disabled" />
          <tsl-combobox-content *tslComboboxPortal><div tslComboboxList></div></tsl-combobox-content>
        </tsl-combobox>
        <tsl-combobox>
          <tsl-combobox-input aria-label="Invalid" placeholder="Invalid" forceInvalid />
          <tsl-combobox-content *tslComboboxPortal>
            <div tslComboboxList>
              @for (skill of skills; track skill) {
                <tsl-combobox-item [value]="skill">{{ skill }}</tsl-combobox-item>
              }
            </div>
          </tsl-combobox-content>
        </tsl-combobox>
      </div>
    `,
  }),
};
