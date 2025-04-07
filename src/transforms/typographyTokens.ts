// Find the screen max values for fluid typography
import {DimensionToken, Token, TokenGroup, TokenType, TypographyToken} from "@supernovaio/sdk-exporters";
import figmaConfig from "../configs/figma.config";
import {typographyFixedHeadingTokenToCSS, typographyFluidToCss, typographyTokenToCSS} from "../content/token";


// Convert typography fluid heading tokens to CSS
export function typographyFluidHeadingTokensToCss(tokens: Token[], tokenGroups: TokenGroup[]): string {

  return mapTypographyFluidSizes(tokens, tokenGroups)
    .map((fluidSize: FluidFontMaxMin) =>
      typographyFluidToCss(
        fluidSize,
        typographyFluidScreenMax(tokens),
        typographyFluidScreenMin(tokens),
      ),
    )
    .join("\n");
}

// Convert typography heading tokens to CSS
export function typographyFixedHeadingTokensToCss(tokens: Token[], tokenGroups: TokenGroup[]): string {

  return tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.typography &&
        t.origin?.name?.includes("Md") &&
        t.origin?.name?.includes("Display")
    )
    .map((token) =>
      typographyFixedHeadingTokenToCSS(
        token as TypographyToken,
        tokenGroups,
        "typography-heading-",
      ),
    )
    .join("\n");
}

// Filter typography tokens
export function typographyTokensToCss(tokens: Token[], tokenGroups: TokenGroup[]): string {
  return tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.typography &&
        !t.origin?.name?.includes("Display"),
    )
    .map((token) =>
      typographyTokenToCSS(
        token as TypographyToken,
        tokenGroups,
        "typography",
      ),
    )
    .join("\n");
}

// Find the screen max values for fluid typography
function typographyFluidScreenMax(tokens: Token[]): number {
  return tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.fontSize &&
        t.origin?.name?.includes(
          figmaConfig.fluid.typographyScreenMaxTokenName,
        ),
    )
    .map((token: DimensionToken) => token.value.measure)?.[0];
}

// Find the screen min values for fluid typography
function typographyFluidScreenMin(tokens: Token[]): number {
  return tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.fontSize &&
        t.origin?.name?.includes(
          figmaConfig.fluid.typographyScreenMinTokenName,
        ),
    )
    .map((token: DimensionToken) => token.value.measure)?.[0];

}

// Map typography fluid sizes
function mapTypographyFluidSizes(tokens: Token[], tokenGroups) {
  const typographyFluidSizes: FluidFontMaxMin[] = [];
  let fluidSize: FluidFontMaxMin = {};

  tokens
    .filter(
      (t) =>
        t.tokenType === TokenType.fontSize &&
        t.origin?.name?.includes(figmaConfig.fluid.headlineIdentifier),
    )
    .forEach((token: DimensionToken) => {
      const parentGroupName = tokenGroups
        .find((group) => group.id === token.parentGroupId)
        ?.name?.replaceAll(" ", "-")
        .toLocaleLowerCase();
      if (!parentGroupName) {
        return;
      }

      if (token.name === "Max Size") {
        fluidSize[parentGroupName] = {max: token.value.measure};
      }

      if (token.name === "Min Size") {
        fluidSize[parentGroupName] = {
          ...fluidSize[parentGroupName],
          min: token.value.measure,
        };
        typographyFluidSizes.push(fluidSize);
        fluidSize = {};
      }
    });
  return typographyFluidSizes;
}
