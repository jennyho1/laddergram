import { Status } from "../types/Status.js";
import words_3letter from "../data/words_3letter.json";
import words_4letter from "../data/words_4letter.json";
import words_5letter from "../data/words_5letter.json";

export function validateLaddergram(
  startWord: string,
  targetWord: string
): Status {
  let success = false;
  let message = "";
  if (startWord.length != targetWord.length) {
    message = "Invalid: Words have different length";
  } else if (startWord === targetWord) {
    message = "Invalid: Starting word must be different from target word";
  } else {
    const wordLists: { [key: number]: string[] } = {
      3: words_3letter,
      4: words_4letter,
      5: words_5letter,
    };

    // Check if word length is valid and both words are in the list
    const wordList = wordLists[startWord.length];
    if (!wordList) {
      message = "Invalid: Unsupported word length";
    } else if (
      !wordList.includes(startWord) ||
      !wordList.includes(targetWord)
    ) {
      message = "Invalid: Starting word is not in the word list";
    } else {
      success = true;
    }
  }

  return { success, message };
}
