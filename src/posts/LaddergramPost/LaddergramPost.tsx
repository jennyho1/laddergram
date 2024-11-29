import { Context, Devvit, useAsync, useState } from "@devvit/public-api";

import { MenuPage } from "./MenuPage.js";
import { GamePage } from "./GamePage.js";
import { PostData } from "../../types/PostData.js";
import { Service } from "../../service/service.js";
import { UserData } from "../../types/UserData.js";

import words_3letter from "../../data/words_3letter.json";
import words_4letter from "../../data/words_4letter.json";
import words_5letter from "../../data/words_5letter.json";

interface LaddergramPostProps {
  userData: UserData;
  postData: PostData;
}

export const LaddergramPost = (
  props: LaddergramPostProps,
  context: Context
): JSX.Element => {
  const service = new Service(context);
  const { userData, postData } = props;
  const [page, setPage] = useState("game");

  const wordLength = postData.startWord.length;
  const [steps, setSteps] = useState(() => {
		if (userData.solved) {
			return userData.result.split(" -> ").map((step)=>step.split(""))
		}
    return [Array.from({ length: wordLength }, () => "")];
  });
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(userData.solved);
  const [stepCounter, setStepCounter] = useState<number>(userData.score);

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

  const onEnter = async (): Promise<void> => {
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
        setStepCounter((step) => step + 1);
        if (wordToEnter == postData.targetWord.toUpperCase()) {
          setSolved(true);
          setErrorMessage("Solved!!");

          // save results to redis
          service.submitSolvedResult({
            postId: postData.postId,
            username: userData.username,
            result: steps.map(step => step.join('')).join(' -> '),
            score: steps.length,
          });
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
      setStepCounter((step) => step - 1);
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

  const pages: Record<string, JSX.Element> = {
    menu: (
      <MenuPage
        onPress={() => {
          setPage("game");
        }}
      />
    ),
    game: (
      <GamePage
        postData={postData}
        onInfoPress={() => setPage("menu")}
        onKeyboardPress={onKeyboardPress}
        onEnter={onEnter}
        onDelete={onDelete}
        errorMessage={errorMessage}
        steps={steps}
        stepCounter={stepCounter}
      />
    ),
    result: (
      <vstack alignment="center middle">
        <text color="global-white">Result Post</text>
      </vstack>
    ),
  };

  /*
   * Return the custom post unit
   */
  return (
    pages[page] || (
      <vstack alignment="center middle" width="100%" height="100%">
        <text color="global-white">Error: Unknown page</text>
      </vstack>
    )
  );
};
