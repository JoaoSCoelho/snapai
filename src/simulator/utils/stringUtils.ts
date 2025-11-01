/**
 * Capitalize the first letter of a given string.
 * @param {string} str - The input string.
 * @returns {string} - The string with the first letter capitalized.
 * @example
 * capitalizeFirstLetter('hello') // 'Hello'
 */
export function capitalizeFirstLetter(str: string): string {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize the first letter of each word in a given string.
 * @param {string} str - The input string.
 * @returns {string} - The string with the first letter of each word capitalized.
 * @example
 * capitalizeFirstLetterOfEachWord('hello world') // 'Hello World'
 */
export function capitalizeFirstLetterOfEachWord(str: string): string {
  return str
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}

/**
 * Replace underscore with camelCase
 * @param {string} str - The input string
 * @returns {string} - The string with underscore replaced with camelCase
 * @example
 * underscoreToCamelCase('hello_world') // 'helloWorld'
 */
export function underscoreToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
