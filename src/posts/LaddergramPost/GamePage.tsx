import { Devvit } from "@devvit/public-api";

import { LetterBlock } from "../../components/LetterBlock.js";
import { KeyboardButton } from "../../components/KeyboardButton.js";
import { PostData } from "../../types/PostData.js";

interface GamePageProps {
  postData: PostData;
  onInfoPress: () => void | Promise<void>;
  onKeyboardPress: (letter: string) => void;
  onEnter: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  errorMessage: string;
  steps: string[][];
	stepCounter: number;
}

export const GamePage = (props: GamePageProps): JSX.Element => {
  const {
    postData,
    onInfoPress,
    onKeyboardPress,
    onEnter,
    onDelete,
    errorMessage,
    steps,
		stepCounter
  } = props;
  const wordLength = postData.startWord.length;
  const blockSize = "36px";
  const blockSpacing = "6px";
  const shorten = steps.length > 5;

  return (
    <vstack width="100%" height="100%">
      <vstack width="100%" height="100%">
        {/* nav */}
        <hstack gap="medium" alignment="top center" padding="medium">
          <text size="xlarge" weight="bold" grow>
            Step Counter: {stepCounter}
          </text>
          <icon
            name="info"
            size="large"
            color="global-white"
            onPress={onInfoPress}
          ></icon>
          <icon name="statistics" size="large" color="global-white"></icon>
        </hstack>

        {/* word boxes */}
        <vstack alignment="center middle" grow>
          {/* starting word */}
          <hstack gap="small">
            {postData.startWord.split("").map((char) => (
              <LetterBlock label={char.toUpperCase()} />
            ))}
          </hstack>
          <spacer height={blockSpacing} />

          {/* word boxes: user guesses*/}
          <vstack>
            {/* compressed */}
            {shorten ? (
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

            {steps.slice(-5).map((step) => (
              <vstack>
                <hstack gap="small">
                  {step.map((letter) => (
                    <LetterBlock label={letter} />
                  ))}
                </hstack>
              </vstack>
            ))}
          </vstack>

          <spacer height={blockSpacing} />
          {/* target word */}
          <hstack gap="small">
            {postData.targetWord.split("").map((char) => (
              <LetterBlock label={char.toUpperCase()} />
            ))}
          </hstack>
        </vstack>

				<spacer height="8px" />

        {/* keyboard */}
        <vstack alignment="center middle" gap="small">
          {errorMessage !== "" ? (
            <hstack alignment="top center">
              <text color="red">{errorMessage}</text>
            </hstack>
          ) : (
            <spacer height="20px" />
          )}

          <hstack>
            {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
              (letter) => {
                return (
                  <hstack>
                    <KeyboardButton
                      onPress={() => onKeyboardPress(letter)}
                      label={letter}
                    />
                    <spacer width="4px" />
                  </hstack>
                );
              }
            )}
          </hstack>
          <hstack>
            {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => {
              return (
                <hstack>
                  <KeyboardButton
                    onPress={() => onKeyboardPress(letter)}
                    label={letter}
                  />
                  <spacer width="4px" />
                </hstack>
              );
            })}
          </hstack>
          <hstack>
            <KeyboardButton
              onPress={onEnter}
              label="Enter"
              backgroundColor="KiwiGreen-400"
              width="46px"
            />
            <spacer width="4px" />
            {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => {
              return (
                <hstack>
                  <KeyboardButton
                    onPress={() => onKeyboardPress(letter)}
                    label={letter}
                  />
                  <spacer width="4px" />
                </hstack>
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
        <spacer height="32px" />
      </vstack>
    </vstack>
  );
};
