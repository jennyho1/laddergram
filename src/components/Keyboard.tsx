import { Devvit } from "@devvit/public-api";
import { CustomButton } from "./CustomButton.js";
import { MyText } from "./MyText.js";

interface KeyboardButtonProps {
	screenWidth: number | undefined;
	pagePadding: string;
  errorMessage: string;
  onKeyboardPress: (value: string) => void;
}

export const Keyboard = (props: KeyboardButtonProps): JSX.Element => {
  const { screenWidth, pagePadding, errorMessage, onKeyboardPress } = props;
	

	const paddingSize = pagePadding == "xsmall" ? 4 : (pagePadding == "medium" ? 16 : 32)
	let enterWidth = 44
	let deleteWidth = 46
	const gapSize = pagePadding == "xsmall" ? 1 : 3

	const gapSizeString: Devvit.Blocks.SizeString = `${gapSize}px`;

	let blockSize = 29;
	if (screenWidth && screenWidth <= 400) {
		let topRowMaxSize = Math.floor((screenWidth - paddingSize*2 - gapSize*9) / 10)
		let botRowMaxSize = Math.floor((screenWidth - paddingSize*2 - enterWidth - deleteWidth - gapSize*8) / 7)
		blockSize = Math.min(topRowMaxSize, botRowMaxSize)
	} else if (screenWidth && screenWidth <= 512) {
		blockSize = 35;
	}

	const topRowWidth = blockSize*10 + gapSize*9
	const botRowWidth = blockSize*7 + gapSize*8 + enterWidth + deleteWidth
	if (topRowWidth > botRowWidth) {
		// add width to the enter/delete button
		let extraWidth = Math.floor((topRowWidth - botRowWidth) / 2)
		enterWidth += extraWidth
		deleteWidth += extraWidth
	}
	if (pagePadding == "large"){
		enterWidth = 52
		deleteWidth = 56
	}

	const textSize = blockSize/60
	const deleteTextSize = deleteWidth/122
	const enterTextSize = deleteTextSize

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
                width={blockSize}
                height={blockSize}
                textSize={textSize}
                onPress={() => onKeyboardPress(letter)}
              />
              <spacer width={gapSizeString} />
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
                width={blockSize}
                height={blockSize}
                textSize={textSize}
                onPress={() => onKeyboardPress(letter)}
              />
              <spacer width={gapSizeString} />
            </hstack>
          );
        })}
      </hstack>
      <spacer height="6px" />
      <hstack>
        <CustomButton
          label="Enter"
          width={enterWidth}
          height={blockSize}
          textSize={enterTextSize}
          overlay={true}
          onPress={() => onKeyboardPress("enter")}
        />
        <spacer width={gapSizeString} />
        {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => {
          return (
            <hstack>
              <CustomButton
                label={letter}
                width={blockSize}
                height={blockSize}
                textSize={textSize}
                onPress={() => onKeyboardPress(letter)}
              />
              <spacer width={gapSizeString} />
            </hstack>
          );
        })}
        <CustomButton
          label="Delete"
          width={deleteWidth}
          height={blockSize}
          textSize={deleteTextSize}
          overlay={true}
          onPress={() => onKeyboardPress("delete")}
        />
      </hstack>
    </vstack>
  );
};
