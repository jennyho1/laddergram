import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface ArrowButtonProps {
  direction: string;
  onPress: () => void | Promise<void>;
}

export const ArrowButton = (props: ArrowButtonProps): JSX.Element => {
  const { direction, onPress } = props;
  if (!(direction == "up" || direction == "down")) return <hstack></hstack>;

  return (
    <image
      url={`arrow_${direction}.png`}
      description="wood button"
      imageHeight={475}
      imageWidth={310}
			height="37px"
			width="24px"
			onPress={onPress}
			resizeMode="fill"
    />
  );
};
