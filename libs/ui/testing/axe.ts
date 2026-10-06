import axe from 'axe-core';

/**
 * Runs axe-core on a rendered element and fails with a readable list of violations.
 * `color-contrast` is disabled because jsdom cannot compute colors; token contrast
 * is verified in libs/tokens/test instead. `region` is page-level, not component-level.
 */
export async function expectNoA11yViolations(
  element: Element,
  rules: axe.RuleObject = {},
): Promise<void> {
  const results = await axe.run(element, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false }, ...rules },
  });
  const report = results.violations
    .map(
      (violation) =>
        `${violation.id}: ${violation.help}\n  ${violation.nodes.map((node) => node.html).join('\n  ')}`,
    )
    .join('\n');
  expect(results.violations, report).toEqual([]);
}
