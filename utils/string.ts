export function hasXSSChars(str: string): boolean {
  const xssChars = /<|>|"|'|&|\/|\+|\\|\0/;
  return xssChars.test(str);
}

export function getInitials(name = "") {
  if ([1, 2].includes(name.length)) {
    return name.toUpperCase();
  } else {
    return name
      .replace(/[_-]/g, " ")
      .split(" ")
      .map((str) => str[0].toUpperCase())
      .join("")
      .slice(0, 2);
  }
}
