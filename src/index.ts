import { FileHelper } from "@supernovaio/export-helpers";
import {
  AnyOutputFile,
  BlurToken,
  ColorToken,
  DimensionToken,
  GradientToken,
  PulsarContext,
  RemoteVersionIdentifier,
  ShadowToken,
  Supernova,
  TokenType,
  TypographyToken,
} from "@supernovaio/sdk-exporters";
import { ExporterConfiguration } from "../config";
import {
  blurTokenToCSS,
  colorTokenToCSS,
  dimensioinTokenToCSS,
  gradientTokenToCSS,
  shadowTokenToCSS,
  typographyFluidToCss,
  typographyTokenToCSS,
} from "./content/token";
import { isTokenComponent, isTokenSemantic } from "./utils/utils";
import figmaConfig from "./configs/figma.config";

/**
 * Export entrypoint.
 * When running `export` through extensions or pipelines, this function will be called.
 * Context contains information about the design system and version that is currently being exported.
 */
Pulsar.export(
  async (
    sdk: Supernova,
    context: PulsarContext,
  ): Promise<Array<AnyOutputFile>> => {
    // Fetch data from design system that is currently being exported (context)
    const remoteVersionIdentifier: RemoteVersionIdentifier = {
      designSystemId: context.dsId,
      versionId: context.versionId,
    };

    // Fetch the necessary data
    let tokens = await sdk.tokens.getTokens(remoteVersionIdentifier);
    let tokenGroups = await sdk.tokens.getTokenGroups(remoteVersionIdentifier);

    // Filter by brand, if specified by the VSCode extension or pipeline configuration
    if (context.brandId) {
      tokens = tokens.filter(
        (token) => token.properties && token.brandId === context.brandId,
      );
      tokenGroups = tokenGroups.filter(
        (tokenGroup) => tokenGroup.brandId === context.brandId,
      );
    }

    // Apply theme, if specified by the VSCode extension or pipeline configuration
    if (context.themeId) {
      const themes = await sdk.tokens.getTokenThemes(remoteVersionIdentifier);
      const theme = themes.find((theme) => theme.id === context.themeId);
      if (theme) {
        tokens = await sdk.tokens.computeTokensByApplyingThemes(tokens, [
          theme,
        ]);
      } else {
        // Don't allow applying theme which doesn't exist in the system
        throw new Error(
          "Unable to apply theme which doesn't exist in the system.",
        );
      }
    }

    let semanticTokensContent = "";
    let componentTokensContent = "";
    let typographyTokensContent = "";

    // Create a map of tokens for easier access
    const mappedTokens = new Map(tokens.map((token) => [token.id, token]));

    // Filter semantic color tokens
    const semanticColorCss = tokens
      .filter((t) => t.tokenType === TokenType.color)
      .filter((t) => isTokenSemantic(t))
      .map((token) =>
        colorTokenToCSS(
          token as ColorToken,
          mappedTokens,
          tokenGroups,
          "color",
        ),
      )
      .join("\n");

    const componentColorCss = tokens
      .filter((t) => t.tokenType === TokenType.color)
      .filter((t) => isTokenComponent(t))
      .map((token) =>
        colorTokenToCSS(token as ColorToken, mappedTokens, tokenGroups),
      )
      .join("\n");

    const semanticDimensionsCss = tokens
      .filter((t) => t.tokenType === TokenType.dimension)
      .filter((t) => isTokenSemantic(t))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((token) =>
        dimensioinTokenToCSS(
          token as DimensionToken,
          mappedTokens,
          tokenGroups,
        ),
      )
      .join("\n");

    const componentDimensionsCss = tokens
      .filter((t) => t.tokenType === TokenType.dimension)
      .filter((t) => isTokenComponent(t))
      .map((token) =>
        dimensioinTokenToCSS(
          token as DimensionToken,
          mappedTokens,
          tokenGroups,
        ),
      )
      .join("\n");

    const semanticGradientCss = tokens
      .filter((t) => t.tokenType === TokenType.gradient)
      .map((token) =>
        gradientTokenToCSS(token as GradientToken, mappedTokens, tokenGroups),
      )
      .join("\n");

    const semanticShadowCss = tokens
      .filter((t) => t.tokenType === TokenType.shadow)
      .map((token) =>
        shadowTokenToCSS(token as ShadowToken, mappedTokens, tokenGroups),
      )
      .join("\n");

    const semanticBlurCss = tokens
      .filter((t) => t.tokenType === TokenType.blur)
      .map((token) =>
        blurTokenToCSS(token as BlurToken, mappedTokens, tokenGroups),
      )
      .join("\n");

    // Find the screen max values for fluid typography
    const typographyFluidScreenMax = tokens
      .filter(
        (t) =>
          t.tokenType === TokenType.dimension &&
          t.origin?.name?.includes(
            figmaConfig.fluid.typographyScreenMaxTokenName,
          ),
      )
      .map((token: DimensionToken) => token.value.measure)?.[0];

    // Find the screen min values for fluid typography
    const typographyFluidScreenMin = tokens
      .filter(
        (t) =>
          t.tokenType === TokenType.dimension &&
          t.origin?.name?.includes(
            figmaConfig.fluid.typographyScreenMinTokenName,
          ),
      )
      .map((token: DimensionToken) => token.value.measure)?.[0];

    const typographyFluidSizes: FluidFontMaxMin[] = [];
    let fluidSize: FluidFontMaxMin = {};

    tokens
      .filter(
        (t) =>
          t.tokenType === TokenType.dimension &&
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
          fluidSize[parentGroupName] = { max: token.value.measure };
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

    const typographyFluidHeadingCss = typographyFluidSizes
      .map((fluidSize: FluidFontMaxMin) =>
        typographyFluidToCss(
          fluidSize,
          typographyFluidScreenMax,
          typographyFluidScreenMin,
        ),
      )
      .join("\n");

    // Filter typography tokens
    const typographyCss = tokens
      .filter(
        (t) =>
          t.tokenType === TokenType.typography &&
          !t.origin?.name?.includes("Display"),
      )
      .map((token) =>
        typographyTokenToCSS(
          token as TypographyToken,
          mappedTokens,
          tokenGroups,
          "typography",
        ),
      )
      .join("\n");

    // Create a JSON object for typography tokens for debugging
    const typographyTokensObject = tokens
      .filter(
        (t) =>
          t.tokenType === TokenType.typography &&
          !t.origin?.name?.includes("Display"),
      )
      .map((token) => JSON.stringify(token))
      .join(",");

    // Create semantic CSS file content
    if (exportConfiguration.generateDisclaimer) {
      // Add disclaimer to every file if enabled
      const autoGenratedText = `/* This file was generated by Supernova, don't change by hand */\n`;
      semanticTokensContent += autoGenratedText;
      componentTokensContent += autoGenratedText;
      typographyTokensContent += autoGenratedText;
    }
    semanticTokensContent += `:root {
${semanticColorCss}
${semanticDimensionsCss}
${semanticGradientCss}
${semanticShadowCss}
${semanticBlurCss}
}`;

    componentTokensContent += `:root {\n${componentColorCss}\n${componentDimensionsCss}\n}`;

    typographyTokensContent += `:root {
  ${typographyFluidHeadingCss}
${typographyCss}
}`;

    // Create debug output files
    const debugOutput = [
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "typographyTokens.json",
        content: `[${typographyTokensObject}]`,
      }),
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "tokenGroups.json",
        content: JSON.stringify(tokenGroups),
      }),
    ];

    // Create output file and return it
    const cssOutputFiles = [
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "semantics.css",
        content: semanticTokensContent,
      }),
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "components.css",
        content: componentTokensContent,
      }),
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "typography.css",
        content: typographyTokensContent,
      }),
    ];
    return [...cssOutputFiles, ...debugOutput];
  },
);

/** Exporter configuration. Adheres to the `ExporterConfiguration` interface and its content comes from the resolved default configuration + user overrides of various configuration keys */
export const exportConfiguration = Pulsar.exportConfig<ExporterConfiguration>();
