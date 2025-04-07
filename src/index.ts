import {FileHelper} from "@supernovaio/export-helpers";

import {ExporterConfiguration} from "../config";
import {
  componentBorderRadiusTokensToCss,
  componentColorTokensToCss,
  componentDimensionsTokensToCss,
  componentFontWeightTokensToCss, componentGenericStringTokensToCss, componentSizeTokensToCss
} from "./transforms/componentTokens";
import {AnyOutputFile, PulsarContext, RemoteVersionIdentifier, Supernova} from "@supernovaio/sdk-exporters";
import {
  semanticBlurTokenToCSS,
  semanticBorderRadiusTokensToCss,
  semanticColorTokensToCss,
  semanticDimensionsTokensToCss,
  semanticGradientTokensToCss,
  semanticShadowTokensToCss
} from "./transforms/semanticTokens";
import {
  typographyFixedHeadingTokensToCss,
  typographyFluidHeadingTokensToCss,
  typographyTokensToCss
} from "./transforms/typographyTokens";

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
    if (context.themeIds && context.themeIds.length > 0) {
      const themes = await sdk.tokens.getTokenThemes(remoteVersionIdentifier);
      const theme = themes.find((theme) => theme.id === context.themeId);
      if (theme) {
        tokens = await sdk.tokens.computeTokensByApplyingThemes(tokens, tokens, themes);
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

    // Output of semantic color tokens to CSS
    const semanticColorCss = semanticColorTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of semantic dimension tokens to CSS
    const semanticDimensionsCss = semanticDimensionsTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of semantic gradient tokens to CSS
    const semanticGradientCss = semanticGradientTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of semantic shadow tokens to CSS
    const semanticShadowCss = semanticShadowTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of semantic blur tokens to CSS
    const semanticBlurCss = semanticBlurTokenToCSS(tokens, mappedTokens, tokenGroups);

    const semanticRadiusCss = semanticBorderRadiusTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of component color tokens to CSS
    const componentColorCss = componentColorTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of component dimension tokens to CSS
    const componentDimensionsCss = componentDimensionsTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of component border radius tokens to CSS
    const componentBorderRadiusCss = componentBorderRadiusTokensToCss(tokens, mappedTokens, tokenGroups);

    // Output of typography fluid heading tokens to CSS
    const typographyFluidHeadingCss = typographyFluidHeadingTokensToCss(tokens, tokenGroups);

    // Output of typography fixed heading tokens to CSS
    const typographyFixedHeadingCss = typographyFixedHeadingTokensToCss(tokens, tokenGroups);

    // Filter typography tokens
    const typographyCss = typographyTokensToCss(tokens, tokenGroups);


    /**
     * Create a JSON object for font weight tokens for debugging
     */
    /*const fontWeightObject = tokens.filter((token) => token.tokenType === TokenType.fontWeight)
      .map((token) => JSON.stringify(token))
      .join(",");*/

    // Create a JSON object for typography tokens for debugging
    /*const typographyTokensObject = tokens
      .filter(
        (t) => t.tokenType === TokenType.typography,
        //&& !t.origin?.name?.includes("Display"),
      )
      .map((token) => JSON.stringify(token))
      .join(",");*/

    // Create header disclaimer for the various CSS file content
    if (exportConfiguration.generateDisclaimer) {
      // Add disclaimer to every file if enabled
      const autoGenratedText = `/* This file was generated by Supernova, don't change by hand */\n/* ${Date()}*/\n`;
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
${semanticRadiusCss}
}`;

componentTokensContent += `:root {
${componentColorCss}
${componentDimensionsCss}
${componentBorderRadiusCss}
${componentFontWeightTokensToCss(tokens, tokenGroups)}
${componentGenericStringTokensToCss(tokens, tokenGroups)}
${componentSizeTokensToCss(tokens, tokenGroups)}
}`;

    typographyTokensContent += `:root {
  ${typographyFluidHeadingCss}
  ${typographyFixedHeadingCss}
${typographyCss}
}`;

    // Create debug output files
    const debugOutput = [
      /*FileHelper.createTextFile({
        relativePath: "./",
        fileName: "typographyTokens.json",
        content: `[${typographyTokensObject}]`,
      }),
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "tokenGroups.json",
        content: JSON.stringify(tokenGroups),
      }),
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "tokenFontWeight.json",
        content: JSON.stringify(fontWeightObject),
      }),*/
    ];

    // Create output files
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
