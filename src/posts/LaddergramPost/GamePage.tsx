import { Devvit } from "@devvit/public-api";

import { LetterBlock } from "../../components/LetterBlock.js";
import { Keyboard } from "../../components/Keyboard.js";
import { PostData } from "../../types/PostData.js";
import { UserData } from "../../types/UserData.js";

interface GamePageProps {
  postData: PostData;
  steps: string[][];
  solved: boolean;
  errorMessage: string;
  onNavPress: (page: string) => void;
  onKeyboardPress: (value: string) => void;
  onSubmitComment: () => void | Promise<void>;
  currentStep: string[];
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
  } = props;
  const wordLength = postData.startWord.length;
  const blockSize = "36px";
  const blockSpacing = "6px";
  const stepsToShow = solved ? 5 : 4;
  const result =
    postData.startWord.toUpperCase() +
    " -> " +
    steps.map((step) => step.join("")).join(" -> ");

  return (
    <vstack width="100%" height="100%" padding="large">
      {/* nav */}
      <hstack gap="medium" alignment="middle center">
        <text size="xlarge" weight="bold" color="global-white" grow>
          Step Counter: {steps.length}
        </text>
        <icon
          name="info"
          size="large"
          color="global-white"
          onPress={() => onNavPress("info")}
        ></icon>
        <icon
          name="statistics"
          size="large"
          color="global-white"
          onPress={() => onNavPress("statistics")}
        ></icon>
      </hstack>

      <spacer height="8px" />

      {/* word boxes */}
      <vstack alignment="center middle" grow>
        {/* starting word */}
        <hstack gap="small">
          {postData.startWord.split("").map((char) => (
            <LetterBlock label={char} />
          ))}
        </hstack>
        <spacer height={blockSpacing} />

        {/* word boxes: user guesses*/}
        <vstack>
          {/* compressed */}
          {steps.length > stepsToShow ? (
            <vstack>
              <hstack gap="small">
                {Array.from({ length: wordLength }, () => (
                  <vstack>
                    <hstack
                      height="1px"
                      width={blockSize}
                      backgroundColor="#c19b7a"
                    ></hstack>
                    <spacer height="3px" />
                    <hstack
                      height="1px"
                      width={blockSize}
                      backgroundColor="#c19b7a"
                    ></hstack>
                    <spacer height="3px" />
                    <hstack
                      height="1px"
                      width={blockSize}
                      backgroundColor="#c19b7a"
                    ></hstack>
                  </vstack>
                ))}
              </hstack>
              <spacer height={blockSpacing} />
            </vstack>
          ) : null}

          {steps.slice(-stepsToShow).map((step) => (
            <vstack>
              <hstack gap="small">
                {step.map((letter, index) => {
                  if (letter == postData.targetWord.charAt(index)) {
                    return <LetterBlock label={letter} correct={true} />;
                  }
                  return <LetterBlock label={letter} />;
                })}
              </hstack>
            </vstack>
          ))}

          {/* current word */}
          <hstack gap="small">
            {solved
              ? null
              : currentStep.map((char) => <LetterBlock label={char} />)}
            {solved
              ? null
              : Array.from(
                  { length: wordLength - currentStep.length },
                  (_, index) => <LetterBlock label="" highlight={index == 0} />
                )}
          </hstack>
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

      <spacer height="8px" />

      {/* keyboard */}
      {solved ? (
        <vstack alignment="center middle" gap="small">
          <hstack
            alignment="top center"
            backgroundColor="rgba(0, 138, 1, 0.7)"
            padding="xsmall"
            border="thin"
            borderColor="rgba(0, 138, 1)"
            cornerRadius="small"
          >
            <text color="global-white" size="small">
              ✨ You solved this in {steps.length} steps! ✨
            </text>
          </hstack>

          <text
            size="small"
            color="global-white"
            maxHeight="40px"
            wrap
            overflow="ellipsis"
            alignment="center middle"
            weight="bold"
          >
            {result}
          </text>
          <button size="small" onPress={onSubmitComment}>
            Leave a comment
          </button>
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
