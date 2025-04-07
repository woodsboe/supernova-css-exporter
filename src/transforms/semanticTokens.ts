
// Find semantic color tokens and convert them to CSS variables
import {
    BlurToken,
    ColorToken,
    DimensionToken,
    GradientToken, RadiusToken,
    ShadowToken,
    Token,
    TokenGroup,
    TokenType
} from "@supernovaio/sdk-exporters";
import {isTokenSemantic} from "../utils/utils";
import {
    blurTokenToCSS,
    colorTokenToCSS,
    dimensionTokenToCSS,
    gradientTokenToCSS,
    shadowTokenToCSS
} from "../content/token";

export function semanticColorTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {

    return tokens
    .filter((t) => t.tokenType === TokenType.color)
    .filter((t) => isTokenSemantic(t))
    .map((token) =>
        colorTokenToCSS(
            token as ColorToken,
            mappedTokens,
            tokenGroups,
        ),
    )
    .join("\n");
}

// Find semantic tokens of type dimension and convert them to CSS variables
export function semanticDimensionsTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {

    return tokens
    .filter((t) => t.tokenType === TokenType.dimension)
    .filter((t) => isTokenSemantic(t))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((token) =>

        dimensionTokenToCSS(
            token as DimensionToken,
            mappedTokens,
            tokenGroups,
        ),
    )
    .join("\n");
}

// Find semantic gradient tokens and convert them to CSS variables
export function semanticGradientTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {
    return tokens
      .filter((t) => t.tokenType === TokenType.gradient)
      //.filter((t) => isTokenSemantic(t))
      .map((token) =>
        gradientTokenToCSS(token as GradientToken, mappedTokens, tokenGroups),
      )
      .join("\n");
}

// Find semantic shadow tokens and convert them to CSS variables
export function semanticShadowTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {
    return tokens
    .filter((t) => t.tokenType === TokenType.shadow)
    //.filter((t) => isTokenSemantic(t))
    .map((token) =>
      shadowTokenToCSS(token as ShadowToken, mappedTokens, tokenGroups),
    )
    .join("\n");
}

// Find semantic blur tokens and convert them to CSS variables
export function semanticBlurTokenToCSS(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {
    return tokens
    .filter((t) => t.tokenType === TokenType.blur)
    //.filter((t) => isTokenSemantic(t))
    .map((token) =>
      blurTokenToCSS(token as BlurToken, mappedTokens, tokenGroups)
    )
    .join("\n");
}

export function semanticBorderRadiusTokensToCss(tokens: Token[], mappedTokens: Map<string, Token>, tokenGroups: TokenGroup[]): string {
    return tokens
    .filter((t) => t.tokenType === TokenType.radius)
    //.filter((t) => isTokenSemantic(t))
    .map((token) =>
      dimensionTokenToCSS(token as RadiusToken, mappedTokens, tokenGroups)
    )
    .join("\n");
}
