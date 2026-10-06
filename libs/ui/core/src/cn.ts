import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge configured for the Tassili utilities defined in
 * @tassili/tokens/tailwind.css, so conflicting token utilities resolve
 * correctly (e.g. `duration-fast` vs `duration-slow`).
 */
const twMerge = extendTailwindMerge<'focus-ring'>({
  extend: {
    classGroups: {
      duration: [{ duration: ['instant', 'fast', 'base', 'slow', 'slower'] }],
      z: [
        {
          z: [
            'base',
            'raised',
            'sticky',
            'header',
            'overlay',
            'modal',
            'popover',
            'toast',
            'tooltip',
          ],
        },
      ],
      h: [{ h: ['control-sm', 'control-md', 'control-lg'] }],
      size: [{ size: ['control-sm', 'control-md', 'control-lg'] }],
      ease: [{ ease: ['standard'] }],
      tracking: [{ tracking: ['display'] }],
      'font-family': [{ font: ['display'] }],
      'focus-ring': ['focus-ring'],
    },
  },
});

/** Merges class lists, letting later Tailwind utilities override earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
