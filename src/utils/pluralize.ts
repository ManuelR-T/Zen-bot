/**
 * Converts a word to its plural form based on specific English grammar rules.
 *
 * @param {string} word - The word to be pluralized.
 * @param {boolean} makePlural - A flag to determine if the word should be made plural. Defaults to true.
 *
 * @returns {string} - The plural form of the word. If `makePlural` is set to false,
 *                     the original word is returned.
 */
export const pluralize = (word: string, makePlural: boolean = true): string => {
  if (!makePlural) {
    return word
  }

  const lowerCasedWord = word.toLowerCase()
  if (
    lowerCasedWord.endsWith('s') ||
    lowerCasedWord.endsWith('x') ||
    lowerCasedWord.endsWith('z') ||
    lowerCasedWord.endsWith('sh') ||
    lowerCasedWord.endsWith('ch')
  ) {
    return word + 'es'
  } else if (
    lowerCasedWord.endsWith('y') &&
    !['a', 'e', 'i', 'o', 'u'].includes(
      lowerCasedWord.charAt(lowerCasedWord.length - 2),
    )
  ) {
    return word.slice(0, -1) + 'ies'
  } else {
    return word + 's'
  }
}
