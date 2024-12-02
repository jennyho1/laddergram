import { Devvit } from "@devvit/public-api";
import { MyText } from "../../components/MyText.js";
import { CustomButton } from "../../components/CustomButton.js";

interface InfoPageProps {
  smallScreen: boolean;
  onPress: () => void | Promise<void>;
}

export const InfoPage = (props: InfoPageProps): JSX.Element => {
  const { onPress, smallScreen } = props;

  return (
    <vstack
      alignment="center middle"
      padding="medium"
      gap={smallScreen ? "medium" : "large"}
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
        imageWidth={408}
        imageHeight={53}
        width="100%"
        maxWidth="330px"
      />
      <vstack alignment="center middle">
        {smallScreen ? (
          <vstack alignment="center middle">
            <MyText size={0.5}>Start with a word and change one</MyText>
            <spacer height="1px" />
            <MyText size={0.5}>letter at a time to create a new</MyText>
            <spacer height="5px" />
            <MyText size={0.5}>word with each step. Try to reach</MyText>
            <spacer height="3px" />
            <MyText size={0.5}>the target word in the fewest</MyText>
            <spacer height="3px" />
            <MyText size={0.5}>steps possible.</MyText>
          </vstack>
        ) : (
          <vstack alignment="center middle">
            <MyText size={0.5}>Start with a word and change one letter</MyText>
            <spacer height="1px" />
            <MyText size={0.5}>at a time to create a new word with</MyText>
            <spacer height="5px" />
            <MyText size={0.5}>each step. Try to reach the target</MyText>
            <spacer height="3px" />
            <MyText size={0.5}>word in the fewest steps possible.</MyText>
          </vstack>
        )}
      </vstack>
			<CustomButton label="Solve laddergram" width={200} height={50} onPress={onPress}/>
      {/* <button appearance="success" onPress={onPress}>
        Solve laddergram
      </button> */}
    </vstack>
  );
};
