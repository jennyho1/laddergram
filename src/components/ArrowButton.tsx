import { Devvit } from "@devvit/public-api";

interface ArrowButtonProps {
  direction: string; // Either "up" or "down"
  onPress: () => void | Promise<void>;
}

export const ArrowButton = (props: ArrowButtonProps): JSX.Element => {
  const { direction, onPress } = props;

  if (!(direction == "up" || direction == "down")) return null;
  return (
    <image
      url={`arrow_${direction}.png`}
      description="arrow button"
      imageHeight={475}
      imageWidth={310}
			height="37px"
			width="24px"
			onPress={onPress}
			resizeMode="fill"
    />
  );
};
