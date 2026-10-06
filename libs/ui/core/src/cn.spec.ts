import { cn } from './cn';

describe('cn', () => {
  it('joins conditional classes', () => {
    const disabled = false;
    expect(cn('a', disabled && 'b', { c: true, d: false }, ['e'])).toBe('a c e');
  });

  it('lets later utilities override earlier ones', () => {
    expect(cn('px-2 bg-primary', 'px-4 bg-secondary')).toBe('px-4 bg-secondary');
  });

  it('resolves Tassili token utilities', () => {
    expect(cn('duration-fast', 'duration-slow')).toBe('duration-slow');
    expect(cn('z-overlay', 'z-tooltip')).toBe('z-tooltip');
    expect(cn('h-control-sm', 'h-control-lg')).toBe('h-control-lg');
    expect(cn('h-8', 'h-control-md')).toBe('h-control-md');
    expect(cn('font-sans', 'font-display')).toBe('font-display');
  });

  it('keeps text size and text color separate', () => {
    expect(cn('text-sm text-primary-foreground', 'text-base')).toBe(
      'text-primary-foreground text-base',
    );
  });
});
