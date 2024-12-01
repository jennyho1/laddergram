import { Devvit } from "@devvit/public-api";

export const LoadingState = (): JSX.Element => (
  <zstack width="100%" height="100%" alignment="center middle">
    <image
      imageHeight={1024}
      imageWidth={2048}
      height="100%"
      width="100%"
      url="background.png"
      description="Zigzag green background"
      resizeMode="cover"
    />
    <image
      url="spinner.gif"
      description="Loading ..."
      imageHeight={200}
      imageWidth={200}
      width="64px"
      height="64px"
      resizeMode="scale-down"
    />
  </zstack>
);
