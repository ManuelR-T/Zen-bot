import isWordValid from './isWordValid'

const MAXGUESSES = 6

class Wordle {
  private targetWord: string
  private guessHistory: string[] = []
  private responseHistory: string[] = []
  private wrongLetterHistory: string[] = []
  private goodLetterHistory: string[] = []
  private guesses = 0
  private iswon = false

  constructor(targetWord: string) {
    this.targetWord = targetWord
  }

  wordlen(): number {
    return this.targetWord.length
  }

  getWordleString(): string {
    let wordle = ''
    for (let i = 0; i < this.targetWord.length; i++) {
      if (this.goodLetterHistory.includes(this.targetWord[i])) {
        wordle += this.targetWord[i].toUpperCase()
      } else {
        wordle += '🟦'
      }
    }
    return wordle
  }

  async guess(word: string): Promise<string> {
    word = word.trim().toLowerCase()

    if (this.iswon) {
      throw 'You have already won today'
    }

    if (this.guesses >= MAXGUESSES) {
      throw 'You have reached the maximum number of guesses'
    }

    if (word.length !== this.targetWord.length) {
      throw 'Invalid word length, you word must be ' + this.targetWord.length + ' letters long'
    }

    if (this.guessHistory.includes(word)) {
      throw 'You have already guessed this word'
    }

    if (!(await isWordValid('./data/wordle_fr.txt', word))) {
      throw 'Invalid word'
    }

    this.guessHistory.push(word)

    let response = ''
    for (let i = 0; i < this.targetWord.length; i++) {
      if (word[i] === this.targetWord[i]) {
        response += '🟩'
        if (!this.goodLetterHistory.includes(word[i])) {
          this.goodLetterHistory.push(word[i])
        }
      } else if (this.targetWord.includes(word[i])) {
        response += '🟨'
      } else {
        response += '🟥'
        if (!this.wrongLetterHistory.includes(word[i])) {
          this.wrongLetterHistory.push(word[i])
        }
      }
    }

    if (response === '🟩'.repeat(this.targetWord.length)) {
      this.iswon = true;
    }
    this.responseHistory.push(response)
    this.guesses++

    return response
  }

  getHistories(): {
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
}

class WordleManager {
  private games: Map<string, Wordle> = new Map()

  createGame(gameId: string, targetWord: string): string {
    this.games.set(gameId, new Wordle(targetWord))
    return gameId
  }

  isThereGame(gameId: string): boolean {
    return this.games.has(gameId)
  }

  wordlen(gameId: string): number | undefined {
    const game = this.games.get(gameId)
    if (game) {
      return game.wordlen()
    }
    return undefined
  }

  async guess(gameId: string, word: string): Promise<string | undefined> {
    const game = this.games.get(gameId)
    if (game) {
      return await game.guess(word)
    }
    return 'Invalid game ID'
  }

  getGameWordLength(gameId: string): number | undefined {
    const game = this.games.get(gameId)
    if (game) {
      return game.wordlen()
    }
    return undefined
  }

  getHistories(gameId: string):
    | {
        guesses: string[]
        responses: string[]
        wrongLetters: string[]
      }
    | undefined {
    const game = this.games.get(gameId)

    if (game) {
      return game.getHistories()
    }
    return undefined
  }

  resetAllGames(): void {
    this.games.clear()
  }
}

const wordleManager = new WordleManager()

export default wordleManager
