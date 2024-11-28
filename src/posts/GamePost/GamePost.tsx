import { Devvit, useAsync, useState } from "@devvit/public-api";

import { LetterBlock } from "../../components/LetterBlock.js";
import { KeyboardButton } from "../../components/KeyboardButton.js";
import { PostData } from "../../types/PostData.js";

import words_3letter from "../../data/words_3letter.json";
import words_4letter from "../../data/words_4letter.json";
import words_5letter from "../../data/words_5letter.json";

interface GamePostProps {
  postData: PostData;
  onInfoPress: () => void | Promise<void>;
}

export const GamePost = (props: GamePostProps): JSX.Element => {
  const { postData, onInfoPress } = props;
  const wordLength = postData.startWord.length;
  const [steps, setSteps] = useState(() => [
    Array.from({ length: wordLength }, () => ""),
  ]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);

  const onKeyboardPress = (letter: string): void => {
    if (solved) return;
    if (currentIndex >= wordLength) return;
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps[currentStep][currentIndex] = letter;
      return newSteps;
    });
    setCurrentIndex((index) => index + 1);
  };

  const onEnter = (): void => {
    if (solved) return;
    if (currentIndex != wordLength) return;
    const wordToEnter = steps[steps.length - 1].join("");
    if (
      (wordLength == 3 && !words_3letter.includes(wordToEnter.toLowerCase())) ||
      (wordLength == 4 && !words_4letter.includes(wordToEnter.toLowerCase())) ||
      (wordLength == 5 && !words_5letter.includes(wordToEnter.toLowerCase()))
    ) {
      setErrorMessage(`${wordToEnter} is an invalid word`);
    } else {
      // checking if only 1 character was changed
      let changes = 0;
      const prevWord =
        currentStep == 0
          ? postData.startWord.toUpperCase()
          : [...steps[steps.length - 2]].join("");
      for (let i = 0; i < wordLength; i++) {
        if (prevWord[i] !== wordToEnter[i]) {
          changes++;
        }
      }
      if (changes == 0) {
        setErrorMessage("Did not change any characters");
      } else if (changes > 1) {
        setErrorMessage("Cannot change more than 1 character");
      } else {
        if (wordToEnter == postData.targetWord.toUpperCase()) {
          setSolved(true);
          setErrorMessage("Solved!!");
        } else {
          setSteps((prevSteps) => {
            const newSteps = [...prevSteps];
            newSteps.push(Array.from({ length: wordLength }, () => ""));
            return newSteps;
          });
          setCurrentStep((step) => step + 1);
          setCurrentIndex(0);
        }
      }
    }
  };

  const onDelete = (): void => {
    if (solved) return;
    setErrorMessage("");
    if (currentIndex == 0) {
      if (currentStep == 0) return;
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        newSteps.pop();
        return newSteps;
      });
      setCurrentStep((step) => step - 1);
      setCurrentIndex(wordLength);
    } else {
      setSteps((prevSteps) => {
        prevSteps[currentStep][currentIndex - 1] = "";
        return prevSteps;
      });
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        const newStep = [...newSteps[currentStep]];
        newStep[currentIndex - 1] = "";
        newSteps[currentStep] = newStep;
        return newSteps;
      });
      setCurrentIndex((index) => index - 1);
    }
  };

  return (
    <vstack width="100%" height="100%">
      <vstack width="100%" height="100%">
        {/* nav */}
        <hstack gap="medium" alignment="top end" padding="medium">
          <icon name="info" color="global-white" onPress={onInfoPress}></icon>
          <icon name="statistics" color="global-white"></icon>
        </hstack>

        {/* word boxes */}
        <vstack gap="medium" alignment="center middle" grow>
          {/* starting word */}
          <vstack gap="medium">
            <hstack gap="small">
              {postData.startWord.split("").map((char) => (
                <LetterBlock label={char.toUpperCase()} />
              ))}
            </hstack>

            {/* word boxes: user guesses*/}
            <vstack gap="small">
              {steps.map((step) => (
                <hstack gap="small">
                  {step.map((letter) => (
                    <LetterBlock label={letter} />
                  ))}
                </hstack>
              ))}
            </vstack>

            {/* target word */}
            <hstack gap="small">
              {postData.targetWord.split("").map((char) => (
                <LetterBlock label={char.toUpperCase()} />
              ))}
            </hstack>
          </vstack>
        </vstack>

        {/* keyboard */}
        <vstack alignment="center middle" gap="small" padding="large">
          {errorMessage !== "" ? (
            <hstack alignment="top center">
              <text color="red">{errorMessage}</text>
            </hstack>
          ) : (
            <spacer height="20px" />
          )}

          <hstack gap="small">
            {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
              (letter) => {
                return (
                  <KeyboardButton
                    onPress={() => onKeyboardPress(letter)}
                    label={letter}
                  />
                );
              }
            )}
          </hstack>
          <hstack gap="small">
            {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => {
              return (
                <KeyboardButton
                  onPress={() => onKeyboardPress(letter)}
                  label={letter}
                />
              );
            })}
          </hstack>
          <hstack gap="small">
            <KeyboardButton
              onPress={onEnter}
              label="Enter"
              backgroundColor="KiwiGreen-400"
              width="46px"
            />
            {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => {
              return (
                <KeyboardButton
                  onPress={() => onKeyboardPress(letter)}
                  label={letter}
                />
              );
            })}
            <KeyboardButton
              onPress={onDelete}
              label="Delete"
              backgroundColor="KiwiGreen-400"
              width="56px"
            />
          </hstack>
        </vstack>
      </vstack>
    </vstack>
  );
};
