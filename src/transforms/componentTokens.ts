import {
  BlurToken,
  ColorToken,
  DimensionToken,
  RadiusToken, SizeToken, StringToken,
  Token,
  TokenGroup,
  TokenType
} from "@supernovaio/sdk-exporters";
import {isTokenComponent, isTokenSemantic} from "../utils/utils";
import {blurTokenToCSS, colorTokenToCSS, dimensionTokenToCSS, stringTokenToCSS} from "../content/token";

// Filter component color tokens
export function componentColorTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {
    return tokens
    .filter((t) => t.tokenType === TokenType.color)
    .filter((t) => isTokenComponent(t))
    .map((token) =>
        colorTokenToCSS(token as ColorToken, mappedTokens, tokenGroups),
)
.join("\n");
}

export function componentDimensionsTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {
    return tokens
    .filter((t) => t.tokenType === TokenType.dimension)
    .filter((t) => isTokenComponent(t))
    .map((token) =>
      dimensionTokenToCSS(
        token as DimensionToken,
        mappedTokens,
        tokenGroups,
      ),
    )
    .join("\n");
}

export function componentBorderRadiusTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {
  return tokens
    .filter((t) => t.tokenType === TokenType.radius)
    .filter((t) => isTokenComponent(t))
    .map((token) =>
      dimensionTokenToCSS(token as RadiusToken, mappedTokens, tokenGroups)
    )
    .join("\n");
}

export function componentFontWeightTokensToCss(
  tokens: Token[],
  tokenGroups: TokenGroup[]): string {
  return tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.fontWeight
    )
    .filter((t) => isTokenComponent(t))
    .map((token: StringToken) =>
      stringTokenToCSS(token as StringToken, tokenGroups),
    )
    .join("\n");
}

/**
 * Convert generic string tokens to CSS custom property.
 * @param tokens
 * @param tokenGroups
 * @returns string
 */
export function componentGenericStringTokensToCss(
  tokens: Token[],
  tokenGroups: TokenGroup[]): string {
  return tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.string
    )
    .filter((t) => isTokenComponent(t))
    .map((token: StringToken) =>
      stringTokenToCSS(token as StringToken, tokenGroups),
    )
    .join("\n");
}

export function componentSizeTokensToCss(
  tokens: Token[],
  tokenGroups: TokenGroup[]): string {
  return tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.size
    )
    .filter((t) => isTokenComponent(t))
    .map((token: SizeToken) =>
      dimensionTokenToCSS(token as SizeToken, new Map(), tokenGroups),
    )
    .join("\n");
}
