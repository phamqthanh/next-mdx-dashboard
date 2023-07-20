export function remToPx(remValue: string | number) {
  let rootFontSize =
    typeof window === "undefined"
      ? 16
      : parseFloat(window.getComputedStyle(document.documentElement).fontSize);

  return parseFloat(String(remValue)) * rootFontSize;
}
