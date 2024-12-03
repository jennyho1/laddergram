import { Devvit } from "@devvit/public-api";
import { CustomButton } from "../../components/CustomButton.js";
import { MenuButton } from "../../components/MenuButton.js";

interface MenuPageProps {
  screenWidth?: number;
}

export const MenuPage = (props: MenuPageProps): JSX.Element => {
  const { screenWidth = 400 } = props;
  const titleLogoWidth = screenWidth < 400 ? screenWidth - 64 : 400;

  return (
    <vstack
      alignment="center middle"
      padding="large"
      width="100%"
      height="100%"
    >
      <image
        url="titleLogo.png"
        description="Title logo"
        imageWidth={titleLogoWidth}
        imageHeight={titleLogoWidth / 7.6981}
      />
      <spacer height="26px" />

      <zstack alignment="center middle" width="100%">
        <vstack alignment="center middle" gap="large">
          <MenuButton
            label="Create Laddergram"
            screenWidth={screenWidth}
            onPress={() => {}}
          />
          <MenuButton
            label="Leaderboard"
            screenWidth={screenWidth}
            onPress={() => {}}
          />
          <MenuButton
            label="My Stats"
            screenWidth={screenWidth}
            onPress={() => {}}
          />
        </vstack>

        {screenWidth >= 400 ? (
          <hstack>
            <image
              imageHeight={542}
              imageWidth={47}
              url="rope.png"
              height="320px"
              description="rope"
            />
            <spacer width="230px" />
            <image
              imageHeight={542}
              imageWidth={47}
              url="rope.png"
              height="320px"
              description="rope"
            />
          </hstack>
        ) : null}
      </zstack>
    </vstack>
  );
};
