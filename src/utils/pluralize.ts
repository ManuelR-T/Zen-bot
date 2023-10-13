export const pluralize = (word: string, makePlural: boolean): string => {
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
