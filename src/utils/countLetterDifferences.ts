// word1 and word2 must be of same length
export function countLetterDifferences(word1: string, word2: string): number {
  if (word1.length !== word2.length) {
    throw new Error("Words must be of the same length");
  }

  let count = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) {
      count++;
    }
  }
  return count;
}