import { Devvit } from "@devvit/public-api";
import { MyText } from "../../components/MyText.js";
import { CustomButton } from "../../components/CustomButton.js";

interface InfoPageProps {
  screenWidth?: number;
  authorUsername: string;
  onPress: () => void | Promise<void>;
}

export const InfoPage = (props: InfoPageProps): JSX.Element => {
  const { onPress, screenWidth = 400, authorUsername } = props;

  const titleLogoWidth = screenWidth < 400 ? screenWidth - 64 : 400;
	//const descriptionWidth = screenWidth < 350 ? screenWidth - 64 : 350;

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
        imageHeight={titleLogoWidth / 7.6981}
      />
      <vstack alignment="center middle">
        {screenWidth < 400 ? (
          <vstack alignment="center middle">
            <MyText size={0.5} mode="light">Start with a word and change one</MyText>
            <MyText size={0.5} topMargin={1} mode="light">
              letter at a time to create a new
            </MyText>
            <MyText size={0.5} topMargin={5} mode="light">
              word with each step. Try to reach
            </MyText>
            <MyText size={0.5} topMargin={3} mode="light">
              the target word in the fewest
            </MyText>
            <MyText size={0.5} topMargin={3} mode="light">
              steps possible.
            </MyText>
          </vstack>
        ) : (
          <vstack alignment="center middle">
            <MyText size={0.5} mode="light">Start with a word and change one letter</MyText>
            <MyText size={0.5} topMargin={1} mode="light">
              at a time to create a new word with
            </MyText>
            <MyText size={0.5} topMargin={5} mode="light">
              each step. Try to reach the target
            </MyText>
            <MyText size={0.5} topMargin={3} mode="light">
              word in the fewest steps possible.
            </MyText>
          </vstack>
        )}
      </vstack>
      <vstack alignment="center middle">
        {authorUsername != "laddergram" ? (
          <MyText size={0.35} mode="med" bottomMargin="3px">
            {`Posted by u/${authorUsername}`}
          </MyText>
        ) : null}

        <CustomButton
          label="Solve laddergram"
          width={180}
          height={40}
          onPress={onPress}
        />
      </vstack>
    </vstack>
  );
};
