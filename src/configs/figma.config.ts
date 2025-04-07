// Figma semantic collection names. Used to filter out semantic tokens.
const semanticCollectionTypes: string[] = [
  "02 Number tokens",
  "03 Semantic colors",
  "04 Semantic tokens",
];

// Figma component collection names. Used to filter out component tokens.
const componentCollectionTypes: string[] = ["05 Components"];

// Figma variables used to identify fluid screen min/max tokens.
const typographyScreenMaxTokenName = "Fluid/Screen Max";
const typographyScreenMinTokenName = "Fluid/Screen Min";

// Variable used to identify heading variables in Figma.
const headlineIdentifier = "Heading";

const figmaConfig = {
  semanticCollectionTypes,
  componentCollectionTypes,
  fluid: {
    headlineIdentifier,
    typographyScreenMaxTokenName,
    typographyScreenMinTokenName,
  },
};

export default figmaConfig;
