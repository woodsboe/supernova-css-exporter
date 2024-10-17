type FluidFontMaxMin = { [key: string]: { max?: number, min?: number } }

type GenerateFluidFontSizeArgs = {
    minScreenWidth?: number,
    maxScreenWidth?: number,
    minFontSize: number,
    maxFontSize: number,
    rootFontSize?: number
  }