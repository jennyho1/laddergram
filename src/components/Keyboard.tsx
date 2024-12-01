import { Devvit } from "@devvit/public-api";
import { KeyboardButton } from "./KeyboardButton.js";

interface KeyboardButtonProps {
  errorMessage: string;
  onKeyboardPress: (value: string) => void;
}

export const Keyboard = (props: KeyboardButtonProps): JSX.Element => {
  const { errorMessage, onKeyboardPress } = props;

  return (
    <vstack alignment="center middle">
      {errorMessage !== "" ? (
        <hstack
          alignment="top center"
          backgroundColor="rgba(143, 0, 0, 0.7)"
          padding="xsmall"
          border="thin"
          borderColor="rgba(143, 0, 0)"
					cornerRadius="small"
        >
          <text color="global-white" size="small">
            {errorMessage}
          </text>
        </hstack>
      ) : (
        <spacer height="26px" />
      )}
			<spacer height="6px" />

      <hstack>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => {
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
			<spacer height="6px" />
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
			<spacer height="6px" />
      <hstack>
        <KeyboardButton
          onPress={() => onKeyboardPress("enter")}
          label="Enter"
          backgroundColor="#ad794b"
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
          onPress={() => onKeyboardPress("delete")}
          label="Delete"
          backgroundColor="#ad794b"
          width="56px"
        />
      </hstack>
    </vstack>
  );
};
