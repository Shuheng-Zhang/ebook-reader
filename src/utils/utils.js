export function px2rem(px) {
  const ratio = 37.5;
  return px / ratio;
}

export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
