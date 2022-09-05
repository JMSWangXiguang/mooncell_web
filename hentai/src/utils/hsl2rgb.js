/*
 * @Author: imali
 * @Date: 2022-05-10 16:54:38
 * @LastEditTime: 2022-06-15 10:45:33
 * @LastEditors: imali
 * @Description:
 */
export function HSL2RGB(H = 0, S = 0, L = 0, stringMode = false) {
  const C = (1 - Math.abs(2 * L - 1)) * S
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1))
  const m = L - C / 2
  const vRGB = []
  if (H >= 0 && H < 60) {
    vRGB.push(C, X, 0)
  } else if (H >= 60 && H < 120) {
    vRGB.push(X, C, 0)
  } else if (H >= 120 && H < 180) {
    vRGB.push(0, C, X)
  } else if (H >= 180 && H < 240) {
    vRGB.push(0, X, C)
  } else if (H >= 240 && H < 300) {
    vRGB.push(X, 0, C)
  } else if (H >= 300 && H < 360) {
    vRGB.push(C, 0, X)
  }
  const [vR, vG, vB] = vRGB
  const R = 255 * (vR + m)
  const G = 255 * (vG + m)
  const B = 255 * (vB + m)

  if (stringMode) {
    return `rgb(${R},${G},${B})`
  }

  return { R, G, B }
}

export function RGB2HSL(r, g, b) {
  r = r / 255
  g = g / 255
  b = b / 255

  var min = Math.min(r, g, b)
  var max = Math.max(r, g, b)
  var l = (min + max) / 2
  var difference = max - min
  // eslint-disable-next-line no-redeclare
  var h, s, l
  if (max == min) {
    h = 0
    s = 0
  } else {
    s = l > 0.5 ? difference / (2.0 - max - min) : difference / (max + min)
    switch (max) {
      case r:
        h = (g - b) / difference + (g < b ? 6 : 0)
        break
      case g:
        h = 2.0 + (b - r) / difference
        break
      case b:
        h = 4.0 + (r - g) / difference
        break
    }
    h = Math.round(h * 60)
  }
  s = Math.round(s * 100) //转换成百分比的形式
  l = Math.round(l * 100)
  return [h, s, l]
}
