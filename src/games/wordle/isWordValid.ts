import * as fs from "fs";

function isWordValid(
  filePath: string,
  wordToCheck: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(
          "Une erreur est survenue lors de la lecture du fichier",
          err
        );
        return reject(err);
      }

      const words = data.split("\n").map((word) => word.trim());
      const isValid = words.includes(wordToCheck.trim());
      resolve(isValid);
    });
  });
}

export default isWordValid;
