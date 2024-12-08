import { Devvit } from "@devvit/public-api";

import { LetterBlock } from "../../components/LetterBlock.js";
import { Keyboard } from "../../components/Keyboard.js";
import { PostData } from "../../types/PostData.js";
import { MyText } from "../../components/MyText.js";
import { CustomIcon } from "../../components/CustomIcon.js";
import { ArrowButton } from "../../components/ArrowButton.js";
import { CustomButton } from "../../components/CustomButton.js";

interface GamePageProps {
  postData: PostData;
  steps: string[][];
  solved: boolean;
  errorMessage: string;
  onNavPress: (page: string) => void;
  onKeyboardPress: (value: string) => void;
  onSubmitComment: () => void | Promise<void>;
  currentStep: string[];
  scrollNumber: number;
  scrollIndex: number;
  onScroll: (direction: string) => void;
}

export const GamePage = (props: GamePageProps): JSX.Element => {
  const {
    postData,
    steps,
    solved,
    errorMessage,
    onNavPress,
    onKeyboardPress,
    onSubmitComment,
    currentStep,
    scrollNumber,
    scrollIndex,
    onScroll,
  } = props;

  const wordLength = postData.startWord.length;
  const blockSize = 36;
  const blockSpacing = "6px";
  const stepsToShow =
    solved || (scrollIndex < scrollNumber && scrollNumber > 0) ? 5 : 4;

  return (
    <vstack width="100%" height="100%" padding="large">
      {/* nav */}
      <hstack gap="medium" alignment="middle center">
        <hstack grow>
          <MyText size={0.6} mode="light">{`Step Counter: ${steps.length}`}</MyText>
        </hstack>
        <CustomIcon icon="info-fill" onPress={() => onNavPress("info")} />
        <CustomIcon
          icon="topic-business-fill"
          onPress={() => onNavPress("statistics")}
        />
      </hstack>

      <spacer height="8px" />

      {/* word boxes */}
      <hstack gap="small" alignment="center middle" grow>
        {scrollNumber <= 0 ? null : <spacer width="24px" />}

        <vstack alignment="center middle">
          {/* starting word */}
          <hstack gap="small">
            {postData.startWord.split("").map((char) => (
              <LetterBlock label={char} />
            ))}
          </hstack>
          <spacer height={blockSpacing} />

          {/* word boxes: user guesses*/}
          <vstack>
            {steps.slice(scrollIndex, scrollIndex + stepsToShow).map((step) => (
              <hstack gap="small">
                {step.map((letter, index) => {
                  if (letter == postData.targetWord.charAt(index)) {
                    return <LetterBlock label={letter} correct={true} />;
                  }
                  return <LetterBlock label={letter} />;
                })}
              </hstack>
            ))}

            {/* current word */}
            {scrollIndex < scrollNumber && scrollNumber > 0 ? null : (
              <hstack gap="small">
                {solved
                  ? null
                  : currentStep.map((char) => <LetterBlock label={char} />)}
                {solved
                  ? null
                  : Array.from(
                      { length: wordLength - currentStep.length },
                      (_, index) => (
                        <LetterBlock label="" highlight={index == 0} />
                      )
                    )}
              </hstack>
            )}
          </vstack>

          <spacer height={blockSpacing} />
          {/* target word */}
          <hstack gap="small">
            {postData.targetWord.split("").map((char, index) => {
              if (steps.length > 0) {
                const lastWord = steps[steps.length - 1];
                if (lastWord[index] == char) {
                  return <LetterBlock label={char} correct={true} />;
                }
              }
              return <LetterBlock label={char} />;
            })}
          </hstack>
        </vstack>
        {scrollNumber <= 0 ? null : (
          <vstack alignment="middle center">
            <ArrowButton
              direction="up"
              onPress={() => onScroll("up")}
            ></ArrowButton>
            <spacer height={`${blockSize / 2 - 2}px`} />
            <MyText size={0.3} mode="light">{`${scrollIndex}/${scrollNumber}`}</MyText>
            <spacer height={`${blockSize / 2 - 2}px`} />
            <ArrowButton
              direction="down"
              onPress={() => onScroll("down")}
            ></ArrowButton>
          </vstack>
        )}
      </hstack>

      <spacer height="8px" />

      {/* keyboard */}
      {solved ? (
        <vstack alignment="center middle" gap="small">
          <hstack
            alignment="top center"
            backgroundColor="rgba(0, 79, 1, 0.7)"
            padding="xsmall"
            border="thin"
            borderColor="rgba(0, 79, 1)"
            cornerRadius="small"
          >
            <text>✨</text>
            <spacer width="3px" />
            <MyText
              size={0.4}
							topMargin="4px"
							mode="light"
            >{`You solved this in ${steps.length} steps!`}</MyText>
            <spacer width="3px" />
            <text>✨</text>
          </hstack>
          <CustomButton
            label="Leave a comment"
            width={180}
            height={40}
            onPress={onSubmitComment}
          />
        </vstack>
      ) : (
        <Keyboard
          errorMessage={errorMessage}
          onKeyboardPress={onKeyboardPress}
        />
      )}
    </vstack>
  );
};
