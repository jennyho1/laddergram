import { Devvit, useAsync } from "@devvit/public-api";

interface MenuPageProps {
	onPress: () => void | Promise<void>;
}

export const MenuPage = (props: MenuPageProps): JSX.Element => {
  const { onPress } = props;

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
      <vstack alignment="center middle" gap="medium">
        <text size="xxlarge" weight="bold" color="global-white" >
          Laddergram
        </text>
        <text alignment="center" maxWidth="250px" color="global-white" wrap>
          Start with a word and change one letter at a time to create a new word
          with each step. The goal is to reach the target word in the fewest
          steps possible.
        </text>
      </vstack>
      <button appearance="success" onPress={onPress}>Solve laddergram</button>
    </vstack>
  );
};
