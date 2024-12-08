import words_3letter from "../data/words_3letter.json";
import words_4letter from "../data/words_4letter.json";
import words_5letter from "../data/words_5letter.json";

// Function to load the correct word list based on word length
function loadWordList(wordLength: number): Set<string> {
  const wordLists: { [key: number]: string[] } = {
    3: words_3letter,
    4: words_4letter,
    5: words_5letter,
  };
  return new Set(wordLists[wordLength] || []);
}

// BFS solution to find the word chain
export function findOptimalSolution(
  startWord: string,
  targetWord: string
): number {
  if (startWord.length !== targetWord.length) {
    console.error(
      "findOptimalSolutionWithChain: Start and target words must have the same length."
    );
    return -1;
  }

  if (startWord === targetWord) return 0;

  let level = 0;
  const wordLength = startWord.length;
  const queue = [];
  queue.push(startWord);

  const wordList = loadWordList(wordLength);
  // Remove the start word from the word list to avoid revisiting
  wordList.delete(startWord);

  while (queue.length > 0) {
    level++;
    const sizeOfQueue = queue.length;

    for (let i = 0; i < sizeOfQueue; i++) {
      const word: string = queue.shift()!;
      const nextWord: string[] = word.split("");

      for (let pos = 0; pos < wordLength; ++pos) {
        const originalChar = nextWord[pos];

        for (let c = "a".charCodeAt(0); c <= "z".charCodeAt(0); c++) {
          if (originalChar === String.fromCharCode(c)) continue;

          nextWord[pos] = String.fromCharCode(c);
          const newWord = nextWord.join("");

          if (newWord === targetWord) return level;

          if (!wordList.has(newWord)) continue;

          wordList.delete(newWord);
          queue.push(newWord);
        }

        nextWord[pos] = originalChar; // Restore the original character
      }
    }
  }

  return -1;
}

export function findOptimalSolutionWithChain(
  startWord: string,
  targetWord: string
): { length: number; chain: string[] | null } {
  if (startWord.length !== targetWord.length) {
    console.error(
      "findOptimalSolutionWithChain: Start and target words must have the same length."
    );
    return { length: -1, chain: null };
  }

  if (startWord === targetWord) return { length: 0, chain: [startWord] };

  let level = 0;
  const wordLength = startWord.length;
  const queue = [];
  queue.push(startWord);

  const wordList = loadWordList(wordLength);
  // Remove the start word from the word list to avoid revisiting
  wordList.delete(startWord);

  // Parent map to reconstruct the chain
  const parentMap: { [word: string]: string | null } = { [startWord]: null };

  while (queue.length > 0) {
    level++;
    const sizeOfQueue = queue.length;

    for (let i = 0; i < sizeOfQueue; i++) {
      const word: string = queue.shift()!;
      const nextWord: string[] = word.split("");

      for (let pos = 0; pos < wordLength; ++pos) {
        const originalChar = nextWord[pos];

        for (let c = "a".charCodeAt(0); c <= "z".charCodeAt(0); c++) {
          if (originalChar === String.fromCharCode(c)) continue;

          nextWord[pos] = String.fromCharCode(c);
          const newWord = nextWord.join("");

          if (newWord === targetWord) {
            parentMap[newWord] = word || startWord;

            return {
              length: level,
              chain: reconstructChain(newWord, parentMap),
            };
          }

          if (!wordList.has(newWord)) continue;

          wordList.delete(newWord);
          queue.push(newWord);
          parentMap[newWord] = word || startWord;
        }

        nextWord[pos] = originalChar; // Restore the original character
      }
    }
  }

  return { length: -1, chain: null }; // No chain found
}

// Helper function to reconstruct the word chain from the parent map
function reconstructChain(
  targetWord: string,
  parentMap: { [word: string]: string | null }
): string[] {
  const chain: string[] = [];
  let currentWord: string | null = targetWord;

  while (currentWord !== null) {
    chain.unshift(currentWord); // Add current word to the front of the chain
    currentWord = parentMap[currentWord]; // Move to the parent word
  }

  return chain;
}
