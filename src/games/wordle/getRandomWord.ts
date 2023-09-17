import fs from 'fs'

function getRandomWord(filePath: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(
          'Une erreur est survenue lors de la lecture du fichier',
          err,
        )
        return reject(err)
      }

      const words = data.split('\n').filter((word) => word.trim().length > 0)

      if (words.length === 0) {
        console.error('Le fichier est vide ou ne contient pas de mots valides')
        return reject()
      }

      const randomWord = words[Math.floor(Math.random() * words.length)]
      console.info('Mot aléatoire :', randomWord)
      resolve(randomWord)
    })
  })
}

export default getRandomWord
