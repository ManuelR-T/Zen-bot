import isWordValid from './isWordValid'

const MAX_GUESSES = 6
const GREEN = '🟩'
const YELLOW = '🟨'
const RED = '🟥'
const BLUE = '🟦'

class Wordle {
  private targetWord: string
  private guessHistory: string[] = []
  private responseHistory: string[] = []
  private wrongLetterHistory: string[] = []
  private wordleStatusDisplay: string[] = []
  private guesses = 0
  private isWon = false

  constructor(targetWord: string) {
    this.targetWord = targetWord
    this.wordleStatusDisplay.push(targetWord[0])
    this.wordleStatusDisplay.fill(BLUE, 1, targetWord.length)
  }

  get wordLength(): number {
    return this.targetWord.length
  }

  async guess(word: string): Promise<string> {
    word = word.trim().toLowerCase()

    await this.validateGuess(word)

    this.guessHistory.push(word)

    let response = ''
    for (let i = 0; i < this.targetWord.length; i++) {
      if (word[i] === this.targetWord[i]) {
        response += GREEN
        this.wordleStatusDisplay[i] = word[i]
      } else if (this.targetWord.includes(word[i])) {
        response += YELLOW
      } else {
        response += RED
        if (!this.wrongLetterHistory.includes(word[i])) {
          this.wrongLetterHistory.push(word[i])
        }
      }
    }

    if (response === GREEN.repeat(this.targetWord.length)) {
      this.isWon = true
    }
    this.responseHistory.push(response)
    this.guesses++

    return response
  }

  private async validateGuess(word: string): Promise<void> {
    if (this.isWon) throw 'You have already won today'
    if (this.guesses >= MAX_GUESSES)
      throw 'You have reached the maximum number of guesses'
    if (word.length !== this.wordLength)
      throw `Invalid word length, your word must be ${this.wordLength} letters long`
    if (this.guessHistory.includes(word))
      throw 'You have already guessed this word'
    if (!(await isWordValid('./data/wordle_fr.txt', word))) throw 'Invalid word'
  }

  get histories(): {
    guesses: string[]
    responses: string[]
    wrongLetters: string[]
  } {
    return {
      guesses: this.guessHistory,
      responses: this.responseHistory,
      wrongLetters: this.wrongLetterHistory,
    }
  }

  get statusDisplay(): string {
    const statusDisplay = this.wordleStatusDisplay.join('')
    for (let i = 0; i < statusDisplay.length; i++) {
      if (statusDisplay[i] === ' ') {
        this.wordleStatusDisplay[i] = BLUE
      }
    }
    return this.wordleStatusDisplay.join('')
  }
}

class WordleManager {
  private games: Map<string, Wordle> = new Map()

  createGame(gameId: string, targetWord: string): string {
    this.games.set(gameId, new Wordle(targetWord))
    return gameId
  }

  hasGame(gameId: string): boolean {
    return this.games.has(gameId)
  }

  getWordLength(gameId: string): number | undefined {
    return this.games.get(gameId)?.wordLength
  }

  async guess(gameId: string, word: string): Promise<string | undefined> {
    return this.games.get(gameId)?.guess(word)
  }

  getHistories(gameId: string):
    | {
        guesses: string[]
        responses: string[]
        wrongLetters: string[]
      }
    | undefined {
    return this.games.get(gameId)?.histories
  }

  getStatusDisplay(gameId: string): string | undefined {
    return this.games.get(gameId)?.statusDisplay
  }

  resetAllGames(): void {
    this.games.clear()
  }
}

const wordleManager = new WordleManager()

export default wordleManager
