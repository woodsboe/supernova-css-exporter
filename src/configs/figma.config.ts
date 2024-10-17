// Figma semantic collection names. Used to filter out semantic tokens.
const semanticCollectionTypes: string[] = [
  "💯 Number tokens",
  "Semantic colors",
  "Semantic tokens",
];

// Figma component collection names. Used to filter out component tokens.
const componentCollectionTypes: string[] = ["Components"];

// Figma variables used to identify fluid screen min/max tokens.
const typographyScreenMaxTokenName = "Fluid/Screen Max";
const typographyScreenMinTokenName = "Fluid/Screen Min";

// Variable used to identify heading variables in Figma.
const headlineIdentifier = "Heading";

// CSS variable format for fluid typography.
const headlineCssVarFormat = "--typography-#NAME#-size-fluid";

const figmaConfig = {
  semanticCollectionTypes,
  componentCollectionTypes,
  fluid: {
    headlineCssVarFormat,
    headlineIdentifier,
    typographyScreenMaxTokenName,
    typographyScreenMinTokenName,
  },
};

export default figmaConfig;
