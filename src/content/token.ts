import {
  NamingHelper,
  CSSHelper,
  ColorFormat,
  StringCase,
} from "@supernovaio/export-helpers";
import {
  BlurToken,
  ColorToken,
  DimensionToken,
  GradientToken,
  ShadowToken,
  Token,
  TokenGroup,
  TypographyToken,
} from "@supernovaio/sdk-exporters";
import { generateCssClapOutput } from "../utils/utils";
import figmaConfig from "../configs/figma.config";
import outputConfig from "../configs/output.config";

/**
 * Convert a color token to CSS custom property.
 * @param token
 * @param mappedTokens
 * @param tokenGroups
 * @param prefix
 */
export function colorTokenToCSS(
  token: ColorToken,
  mappedTokens: Map<string, Token>,
  tokenGroups: Array<TokenGroup>,
  prefix: string | null = null,
): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  const name = tokenVariableName(token, tokenGroups, prefix);

  // Then creating the value of the token, using another helper function
  const value = CSSHelper.colorTokenValueToCSS(token.value, mappedTokens, {
    allowReferences: false,
    decimals: 3,
    colorFormat: ColorFormat.smartHashHex,
    tokenToVariableRef: (t) => {
      return `var(--${tokenVariableName(t, tokenGroups)})`;
    },
  });

  return `  --${name}: ${value};`;
}

/**
 * Convert a dimension token to CSS custom property.
 * @param token
 * @param mappedTokens
 * @param tokenGroups
 * @param prefix
 */
export function dimensioinTokenToCSS(
  token: DimensionToken,
  mappedTokens: Map<string, Token>,
  tokenGroups: Array<TokenGroup>,
  prefix: string | null = null,
): string {
  const name = tokenVariableName(token, tokenGroups, prefix);
  const value = CSSHelper.dimensionTokenValueToCSS(token.value, mappedTokens, {
    allowReferences: false,
    decimals: 3,
    colorFormat: ColorFormat.smartHashHex,
    tokenToVariableRef: (t) => {
      return `var(--${tokenVariableName(t, tokenGroups)})`;
    },
  });

  return `  --${name}: ${value};`;
}

/**
 * Convert a gradient token to CSS custom property.
 * @param token
 * @param mappedTokens
 * @param tokenGroups
 * @param prefix
 */
export function gradientTokenToCSS(
  token: GradientToken,
  mappedTokens: Map<string, Token>,
  tokenGroups: Array<TokenGroup>,
  prefix: string | null = null,
): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  const name = tokenVariableName(token, tokenGroups, prefix);

  // Then creating the value of the token, using another helper function
  const value = CSSHelper.gradientTokenValueToCSS(token.value, mappedTokens, {
    allowReferences: false,
    decimals: 3,
    colorFormat: ColorFormat.smartHashHex,
    tokenToVariableRef: (t) => {
      return `var(--${tokenVariableName(t, tokenGroups)})`;
    },
  });

  return `  --${name}: ${value};`;
}

/**
 * Convert a shadow token to CSS custom property.
 * @param token
 * @param mappedTokens
 * @param tokenGroups
 * @param prefix
 */
export function shadowTokenToCSS(
  token: ShadowToken,
  mappedTokens: Map<string, Token>,
  tokenGroups: Array<TokenGroup>,
  prefix: string | null = null,
): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  const name = tokenVariableName(token, tokenGroups, prefix);

  // Then creating the value of the token, using another helper function
  const value = CSSHelper.shadowTokenValueToCSS(token.value, mappedTokens, {
    allowReferences: false,
    decimals: 3,
    colorFormat: ColorFormat.hashHex8,
    tokenToVariableRef: (t) => {
      return `var(--${tokenVariableName(t, tokenGroups)})`;
    },
  });

  return `  --${name}: ${value};`;
}

/**
 * Convert a blur token to CSS custom property.
 * @param token
 * @param mappedTokens
 * @param tokenGroups
 * @param prefix
 */
export function blurTokenToCSS(
  token: BlurToken,
  mappedTokens: Map<string, Token>,
  tokenGroups: Array<TokenGroup>,
  prefix: string | null = null,
): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  const name = tokenVariableName(token, tokenGroups, prefix);

  // Then creating the value of the token, using another helper function
  const value = CSSHelper.blurTokenValueToCSS(token.value, mappedTokens, {
    allowReferences: false,
    decimals: 3,
    colorFormat: ColorFormat.hashHex8,
    tokenToVariableRef: (t) => {
      return `var(--${tokenVariableName(t, tokenGroups)})`;
    },
  });

  return `  --${name}: ${value};`;
}

/**
 * Convert a typography token to CSS custom property.
 * @param token
 * @param mappedTokens
 * @param tokenGroups
 * @param prefix
 */
export function typographyTokenToCSS(
  token: TypographyToken,
  mappedTokens: Map<string, Token>,
  tokenGroups: Array<TokenGroup>,
  prefix: string | null = null,
): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  const name = tokenVariableName(token, tokenGroups, prefix);

  // Then creating the value of the token, using another helper function
  /*const value = CSSHelper.typographyTokenValueToCSS(token.value, mappedTokens, {
    allowReferences: false,
    decimals: 3,
    colorFormat: ColorFormat.smartHashHex,
    tokenToVariableRef: (t) => {
      return `var(--${tokenVariableName(t, tokenGroups)})`;
    },
  });*/
  const value = "";

  return `--${name}: ${value};`;
}

export function typographyFluidToCss(
  fluidSize: FluidFontMaxMin,
  screenMax: number,
  screenMin: number,
) {
  const cssVariableName = Object.keys(fluidSize)[0];

  const clampValue = generateCssClapOutput({
    minScreenWidth: screenMin,
    maxScreenWidth: screenMax,
    minFontSize: fluidSize[cssVariableName].min!,
    maxFontSize: fluidSize[cssVariableName].max!,
  });

  return `${outputConfig.formatting.headlineCssVarFormat.replace(
    "#NAME#",
    cssVariableName,
  )}: ${clampValue};`;
}

/**
 * Get the variable name for the token.
 * @param token
 * @param tokenGroups
 * @param prefix
 */
function tokenVariableName(
  token: Token,
  tokenGroups: Array<TokenGroup>,
  prefix: string | null = null,
): string {
  const parent = tokenGroups.find((group) => group.id === token.parentGroupId)!;
  return NamingHelper.codeSafeVariableNameForToken(
    token,
    StringCase.paramCase,
    parent,
    prefix,
  );
}
