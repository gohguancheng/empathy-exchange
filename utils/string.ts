
export function hasXSSChars(str: string): boolean {
  const xssChars = /<|>|"|'|&|\/|\+|\\|\0/;
  return xssChars.test(str);
}
