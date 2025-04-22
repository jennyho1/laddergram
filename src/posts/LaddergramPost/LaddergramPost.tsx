import { Context, Devvit, useState } from "@devvit/public-api";

import { InfoPage } from "./InfoPage.js";
import { GamePage } from "./GamePage.js";
import { StatisticsPage } from "./StatisticsPage.js";
import { LaddergramPostData, PostData } from "../../types/PostData.js";
import { Service } from "../../service/service.js";
import { UserPostData } from "../../types/UserData.js";

import words_3letter from "../../data/words_3letter.json" with { type: "json" };
import words_4letter from "../../data/words_4letter.json" with { type: "json" };
import words_5letter from "../../data/words_5letter.json" with { type: "json" };
import { countLetterDifferences } from "../../utils/countLetterDifferences.js";

interface LaddergramPostProps {
  userPostData: UserPostData;
  postData: LaddergramPostData;
}

export const LaddergramPost = (
  props: LaddergramPostProps,
  context: Context
): JSX.Element => {
  const { userPostData, postData } = props;
  const service = new Service(context);

  const wordLength = postData.startWord.length;
  const [page, setPage] = useState(userPostData.solved ? "game" : "info");
  const [steps, setSteps] = useState(() => {
    if (userPostData.solved) {
      return userPostData.result
        .split(" -> ")
        .slice(1)
        .map((step) => step.split(""));
    }
    return [];
  });
  const [currentStep, setCurrentStep] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(userPostData.solved);
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
      const prevWord =
        steps.length == 0
          ? postData.startWord
          : steps[steps.length - 1].join("");

			const changes = countLetterDifferences(prevWord, wordToEnter)
      if (changes == 0) {
        setErrorMessage("Did not change any characters");
      } else if (changes > 1) {
        setErrorMessage("Cannot change more than 1 character");
      } else {
        //player tried it
        if (steps.length == 0) {
          service.submitTried(postData.postId, userPostData.username);
        }
        // PLAYER SOLVED IT
        if (wordToEnter == postData.targetWord) {
          setSolved(true);
          // save results to redis
          service.submitSolvedResult({
            postId: postData.postId,
            username: userPostData.username,
            result:
              `${postData.startWord} -> ` +
              steps.map((step) => step.join("")).join(" -> ") +
              ` -> ${currentStep.join("")}`,
            score: steps.length + 1,
						wordLength,
						daily: postData.postType == "daily"
          });
        } else {
          setScrollNumber((n) => n + 1);
          setScrollIndex(scrollNumber+1 < 0 ? 0 : scrollNumber + 1);
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
			setScrollIndex(scrollNumber-1 < 0 ? 0 : scrollNumber - 1);
    } else {
      setCurrentStep(currentStep.slice(0, -1));
    }
  };

  const onSubmitComment = async (): Promise<void> => {
    const status = await service.submitComment(postData.postId, userPostData.username);
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
				screenWidth={context.dimensions?.width}
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
      />
    ),
    statistics: (
      <StatisticsPage postData={postData} solved={solved} score={steps.length} onNavPress={onNavPressHandler} />
    ),
  };

  return (
    pages[page] || (
      <vstack alignment="center middle" width="100%" height="100%">
        <text color="global-white">Error: Unknown page</text>
      </vstack>
    )
  );
};
