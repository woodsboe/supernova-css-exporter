import {ElementProperty, ElementPropertyOption, Token} from "@supernovaio/sdk-exporters";
import {figmaComponentCollectionTypes, figmaSemanticCollectionTypes} from "../configs/figma-colletion-types";

/**
 * Get the collection option from the collection object.
 * @param options
 * @param collectionId
 */
function getCollectionOption(options: ElementPropertyOption[] | null | undefined, collectionId: string): ElementPropertyOption | null {
  const option = options ? options.find((option) => option.id === collectionId) : null;
  return option || null;
}

/**
 * Get the collection object from the token properties.
 * @param properties
 */
function getCollectionObjectFromProperties(properties:
                                             ElementProperty[]): ElementProperty | undefined {
  return properties.find((propertyObj) => propertyObj.codeName === 'Collection');
}

/**
 * Check if the collection is semantic.
 * @param collection - The collection id.
 * @param properties
 */
function isCollectionSemantic(collection: string | boolean | number, properties: ElementProperty[]): boolean {
  // Get the collection object from the properties
  const collectionObject = getCollectionObjectFromProperties(properties);

  if (!collectionObject) {
    return false;
  }

  // Check if the collection id is in the options
  const collectionOption = getCollectionOption(collectionObject.options, collection.toString());

  if (!collectionOption) {
    return false;
  }

  // Check if the collection name matches one of the semantic collection types from figma.
  return figmaSemanticCollectionTypes.includes(collectionOption.name);
}

function isCollectionComponent(collection: string | boolean | number, properties: ElementProperty[]): boolean {
  // Get the collection object from the properties
  const collectionObject = getCollectionObjectFromProperties(properties);

  if (!collectionObject) {
    return false;
  }

  // Check if the collection id is in the options
  const collectionOption = getCollectionOption(collectionObject.options, collection.toString());

  if (!collectionOption) {
    return false;
  }

  // Check if the collection name matches one of the component collection types from figma.
  return figmaComponentCollectionTypes.includes(collectionOption.name);
}

/**
 * Check if the token is semantic.
 * @param token
 */
export function isTokenSemantic(token: Token): boolean {
  const hasTokenSet = Boolean(token.propertyValues.tokensSet);
  const hasCollection = Boolean(token.propertyValues.Collection);

  if (hasTokenSet) {
    return token.propertyValues.tokensSet === 'token-set-semantic';
  }

  if (hasCollection) {
    return isCollectionSemantic(token.propertyValues.Collection, token.properties);
  }

  return false;
}

export function isTokenComponent(token: Token): boolean {
  const hasTokenSet = Boolean(token.propertyValues.tokensSet);
  const hasCollection = Boolean(token.propertyValues.Collection);

  if (hasTokenSet) {
    return token.propertyValues.tokensSet === 'token-set-component';
  }

  if (hasCollection) {
    return isCollectionComponent(token.propertyValues.Collection, token.properties);
  }

  return false;
}
