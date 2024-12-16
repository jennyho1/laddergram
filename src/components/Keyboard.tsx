import { Devvit } from "@devvit/public-api";
import { CustomButton } from "./CustomButton.js";
import { MyText } from "./MyText.js";

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
          alignment="middle center"
          backgroundColor="rgba(143, 0, 0, 0.7)"
          height="26px"
          border="thin"
          borderColor="rgba(143, 0, 0)"
          cornerRadius="small"
        >
          <spacer width="4px" />
          <MyText size={0.4} mode="light">
            {errorMessage}
          </MyText>
          <spacer width="4px" />
        </hstack>
      ) : (
        <spacer height="26px" />
      )}
      <spacer height="8px" />

      <hstack>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => {
          return (
            <hstack>
              <CustomButton
                label={letter}
                width={22}
                height={22}
                textSize={0.4}
                onPress={() => onKeyboardPress(letter)}
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
              <CustomButton
                label={letter}
                width={22}
                height={22}
                textSize={0.4}
                onPress={() => onKeyboardPress(letter)}
              />
              <spacer width="4px" />
            </hstack>
          );
        })}
      </hstack>
      <spacer height="6px" />
      <hstack>
        <CustomButton
          label="Enter"
          width={48}
          height={22}
          textSize={0.4}
          overlay={true}
          onPress={() => onKeyboardPress("enter")}
        />
        <spacer width="4px" />
        {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => {
          return (
            <hstack>
              <CustomButton
                label={letter}
                width={22}
                height={22}
                textSize={0.4}
                onPress={() => onKeyboardPress(letter)}
              />
              <spacer width="4px" />
            </hstack>
          );
        })}
        <CustomButton
          label="Delete"
          width={52}
          height={22}
          textSize={0.4}
          overlay={true}
          onPress={() => onKeyboardPress("delete")}
        />
      </hstack>
    </vstack>
  );
};
