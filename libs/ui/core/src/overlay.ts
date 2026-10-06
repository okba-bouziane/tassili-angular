/**
 * Shared look of floating surfaces (select, popover, menus, combobox, tooltip):
 * popover background, hairline border, medium shadow, and a short scale/fade
 * entrance that respects reduced motion through the duration tokens.
 */
export const overlaySurface = [
  'bg-popover text-popover-foreground rounded-lg border shadow-md',
  'duration-fast data-open:animate-in data-closed:animate-out',
  'data-open:fade-in-0 data-closed:fade-out-0 data-open:zoom-in-95 data-closed:zoom-out-95',
  'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
  'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1', // tsl-allow-style: CDK reports the physical side the panel opened on
];

/** Shared look of selectable rows inside floating lists (select items, menu items). */
export const overlayItem = [
  'relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none',
  'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
  'data-disabled:pointer-events-none data-disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
];
