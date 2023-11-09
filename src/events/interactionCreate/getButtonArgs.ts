export const getButtonArgs = (
  prefix: string,
  str: string,
): Map<string, string> => {
  const regex = new RegExp(`${prefix}(\\[.+?\\])+`, 'g')
  const match = str.match(regex)
  if (!match) return new Map()

  const elements =
    match[0]
      .slice(prefix.length)
      .match(/\[(.*?)\]/g)
      ?.map((elem) => {
        const matches = /([^:]+):(.+)/.exec(elem.slice(1, -1))
        return matches
          ? ([matches[1], matches[2]] as [string, string])
          : undefined
      })
      .filter((elem): elem is [string, string] => elem !== undefined) || []

  return new Map<string, string>(elements)
}
