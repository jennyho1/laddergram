import { Context, Devvit, useAsync, useState } from "@devvit/public-api";

import { InfoPage } from "./InfoPage.js";
import { GamePage } from "./GamePage.js";
import { StatisticsPage } from "./StatisticsPage.js";
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
  const { userData, postData } = props;
  const service = new Service(context);

  const wordLength = postData.startWord.length;
  const [page, setPage] = useState(userData.solved ? "game" : "game"); // ---------TODO change to "info"
  const [steps, setSteps] = useState(() => {
    if (userData.solved) {
      return userData.result
        .split(" -> ")
        .slice(1)
        .map((step) => step.split(""));
    }
    return [];
  });
  const [currentStep, setCurrentStep] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(userData.solved);

  // const [stepsToShow, setStepsToShow] = useState<number>(solved ? 5 : 4);
  const [scrollNumber, setScrollNumber] = useState<number>(
    steps.length - (solved ? 5 : 4)
  );
  const [scrollIndex, setScrollIndex] = useState<number>(
    scrollNumber <= 0 ? 0 : scrollNumber
  );

  const onScrollHandler = (direction: string) => {
    if (direction == "up") {
      if (scrollIndex > 0) setScrollIndex((i) => i - 1);
    } else if (direction == "down") {
      if (scrollIndex < scrollNumber) setScrollIndex((i) => i + 1);
    }
  };

  const onKeyboardPressHandler = (value: string): void => {
    if (solved) return;
    setScrollIndex(scrollNumber <= 0 ? 0 : scrollNumber);
    if (value === "enter") onEnter();
    else if (value == "delete") onDelete();
    else onLetter(value);
  };

  const onLetter = (letter: string): void => {
    if (currentStep.length >= wordLength) return;
    setCurrentStep([...currentStep, letter]);
  };

  const onEnter = async (): Promise<void> => {
    if (currentStep.length != wordLength) return;
    const wordToEnter = currentStep.join("");
    if (
      (wordLength == 3 && !words_3letter.includes(wordToEnter.toLowerCase())) ||
      (wordLength == 4 && !words_4letter.includes(wordToEnter.toLowerCase())) ||
      (wordLength == 5 && !words_5letter.includes(wordToEnter.toLowerCase()))
    ) {
      setErrorMessage(`${wordToEnter} is not in the word list`);
    } else {
      // checking if only 1 character was changed
      let changes = 0;
      const prevWord =
        steps.length == 0
          ? postData.startWord
          : steps[steps.length - 1].join("");
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
        //player tried it
        if (steps.length == 0) {
          service.submitTried(postData.postId, userData.username);
        }
        // PLAYER SOLVED IT
        if (wordToEnter == postData.targetWord) {
          setSolved(true);
          // setStepsToShow(5);
          // save results to redis
          service.submitSolvedResult({
            postId: postData.postId,
            username: userData.username,
            result:
              `${postData.startWord} -> ` +
              steps.map((step) => step.join("")).join(" -> ") +
              ` -> ${currentStep.join("")}`,
            score: steps.length + 1,
						wordLength
          });
        } else {
          setScrollNumber((n) => n + 1);
          setScrollIndex(scrollNumber < 0 ? 0 : scrollNumber + 1);
        }
        setSteps([...steps, currentStep]);
        setCurrentStep([]);
      }
    }
  };

  const onDelete = (): void => {
    setErrorMessage("");
    if (currentStep.length == 0) {
      if (steps.length == 0) return;
      setCurrentStep(steps[steps.length - 1]);
      setSteps(steps.slice(0, -1));
      setScrollNumber((n) => n - 1);
    } else {
      setCurrentStep(currentStep.slice(0, -1));
    }
  };

  const onSubmitComment = async (): Promise<void> => {
    const status = await service.submitComment(postData.postId, userData);
    if (!status.success) context.ui.showToast(status.message);
  };

  const onNavPressHandler = (page: string): void => {
    setPage(page);
  };

  const pages: Record<string, JSX.Element> = {
    info: (
      <InfoPage
        screenWidth={context.dimensions?.width}
        authorUsername={postData.authorUsername}
        onPress={() => {
          setPage("game");
        }}
      />
    ),
    game: (
      <GamePage
        postData={postData}
        steps={steps}
        solved={solved}
        errorMessage={errorMessage}
        onNavPress={onNavPressHandler}
        onKeyboardPress={onKeyboardPressHandler}
        onSubmitComment={onSubmitComment}
        currentStep={currentStep}
        scrollIndex={scrollIndex}
        scrollNumber={scrollNumber}
        onScroll={onScrollHandler}
        // stepsToShow={stepsToShow}
      />
    ),
    statistics: (
      <StatisticsPage postData={postData} onNavPress={onNavPressHandler} />
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
