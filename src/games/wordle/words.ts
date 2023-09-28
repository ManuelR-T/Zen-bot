import * as fs from 'fs/promises'

const words: Set<string> = await (async () => {
  try {
    const data = await fs.readFile('./data/wordle_fr.txt', 'utf8')
    return new Set(data.split('\n').map((word) => word.trim()))
  } catch (err) {
    console.error('Error reading words', err)
    process.exit(1)
  }
})()

function isWordValid(wordToCheck: string): boolean {
  return words.has(wordToCheck.trim())
}

function getRandomWord(): string {
  const randomIndex = Math.floor(Math.random() * words.size)
  return Array.from(words)[randomIndex]
}

export { isWordValid, getRandomWord }
