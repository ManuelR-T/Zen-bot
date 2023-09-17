export const stringToEmoji = (str: string): string => {
  console.log ("-",str,"-")
  return str
    .toLowerCase()
    .replace(
      /[a-z]/g,
      (match) =>
        `:regional_indicator_${String.fromCharCode(match.charCodeAt(0))}:`,
    )
}
