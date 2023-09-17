import isWordValid from "./isWordValid"

class Wordle {
  private targetWord: string
  private guessHistory: string[] = []
  private responseHistory: string[] = []
  private guesses = 0
  constructor(targetWord: string) {
    this.targetWord = targetWord
  }

  wordlen(): number {
    return this.targetWord.length
  }

  async guess(word: string): Promise<string> {
    word = word.trim().toLowerCase()
    if (this.guesses >= 5) {
      throw 'You have reached the maximum number of guesses'
    }

    if (word.length !== this.targetWord.length) {
      throw 'Invalid word length'
    }

    if (this.guessHistory.includes(word)) {
      throw 'You have already guessed this word'
    }

    if (!(await isWordValid("./data/wordle_fr.txt", word))) {
      throw "Invalid word";
    }

    this.guessHistory.push(word)

    let response = ''
    for (let i = 0; i < this.targetWord.length; i++) {
      if (word[i] === this.targetWord[i]) {
        response += 'G'
      } else if (this.targetWord.includes(word[i])) {
        response += 'Y'
      } else {
        response += 'R'
      }
    }

    this.responseHistory.push(response)
    this.guesses++

    //TODO: Create a wrong letter History
    return response
  }

  getHistory(): [string[], string[]] {
    return [this.guessHistory, this.responseHistory]
  }
}

export class WordleManager {
  private games: Map<string, Wordle> = new Map()

  createGame(targetWord: string, gameId: string): string {
    this.games.set(gameId, new Wordle(targetWord))
    //TODO: Update database timestamp
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

  async guess(gameId: string, word: string): Promise <string | undefined> {
    const game = this.games.get(gameId)
    if (game) {
      try {
        return await game.guess(word)
      }
      catch (error) {
        throw error
      }
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

  getHistory(gameId: string): [string[], string[]] | undefined {
    const game = this.games.get(gameId)
    if (game) {
      return game.getHistory()
    }
    return undefined
  }

  resetAllGames(): void {
    this.games.clear()
  }
}
