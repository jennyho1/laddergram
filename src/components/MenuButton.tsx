import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface MenuButtonProps {
  label: string;
  screenWidth: number;
  onPress: () => void | Promise<void>;
}

export const MenuButton = (props: MenuButtonProps): JSX.Element => {
  const {
    label,
		screenWidth,
    onPress,
  } = props;
	const height = "70px"
	let width: Devvit.Blocks.SizeString = screenWidth < 400 ? `${screenWidth-64}px` : "400px";

  return (
    <zstack
      width={width}
      height={height}
      alignment="center middle"
      onPress={onPress}
    >
      <image
        url={`woodButton_large.png`}
        description="wood button"
        imageHeight={height}
        imageWidth={width}
        width="100%"
        height="100%"
        resizeMode="fill"
      />

      <MyText size={0.6}>
        {label}
      </MyText>
    </zstack>
  );
};
