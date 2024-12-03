import { Devvit } from "@devvit/public-api";
import { MyText } from "../../components/MyText.js";
import { CustomButton } from "../../components/CustomButton.js";

interface InfoPageProps {
  screenWidth?: number;
  onPress: () => void | Promise<void>;
}

export const InfoPage = (props: InfoPageProps): JSX.Element => {
  const { onPress, screenWidth = 400 } = props;

	const titleLogoWidth = screenWidth < 400 ? screenWidth-64 : 400;

  return (
    <vstack
      alignment="center middle"
      padding="medium"
      gap="large"
      width="100%"
      height="100%"
    >
      <image
        url="logo.png"
        description="logo"
        imageHeight={500}
        imageWidth={500}
        height="64px"
        width="64px"
      />
      <image
        url="titleLogo.png"
        description="Title logo"
        imageWidth={titleLogoWidth}
        imageHeight={titleLogoWidth/7.6981}
      />
      <vstack alignment="center middle">
        {screenWidth < 400 ? (
          <vstack alignment="center middle">
            <MyText size={0.5}>Start with a word and change one</MyText>
            <MyText size={0.5} topMargin={1}>
              letter at a time to create a new
            </MyText>
            <MyText size={0.5} topMargin={5}>
              word with each step. Try to reach
            </MyText>
            <MyText size={0.5} topMargin={3}>
              the target word in the fewest
            </MyText>
            <MyText size={0.5} topMargin={3}>
              steps possible.
            </MyText>
          </vstack>
        ) : (
          <vstack alignment="center middle">
            <MyText size={0.5}>Start with a word and change one letter</MyText>
            <MyText size={0.5} topMargin={1}>
              at a time to create a new word with
            </MyText>
            <MyText size={0.5} topMargin={5}>
              each step. Try to reach the target
            </MyText>
            <MyText size={0.5} topMargin={3}>
              word in the fewest steps possible.
            </MyText>
          </vstack>
        )}
      </vstack>
      <CustomButton
        label="Solve laddergram"
        width={180}
        height={50}
        onPress={onPress}
      />
      {/* <button appearance="success" onPress={onPress}>
        Solve laddergram
      </button> */}
    </vstack>
  );
};
