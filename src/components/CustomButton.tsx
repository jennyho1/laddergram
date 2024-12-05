import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface CustomButtonProps {
  label: string;
  width: number;
  height: number;
  textSize?: number;
  overlay?: boolean;
  onPress: () => void | Promise<void>;
}

const dimensions: Record<string, { width: number; height: number }> = {
  square: { width: 500, height: 500 },
  small: { width: 500, height: 235 },
  large: { width: 1024, height: 243 },
};

export const CustomButton = (props: CustomButtonProps): JSX.Element => {
  const {
    label,
    width,
    height,
    textSize = 0.5,
    overlay = false,
    onPress,
  } = props;
  const ratio = width / height;
  const size = ratio == 1 ? "square" : ratio > 3 ? "large" : "small";

  return (
    <zstack
      width={`${width}px`}
      height={`${height}px`}
      alignment="center middle"
      onPress={onPress}
    >
      <image
        url={`woodButton_${size}.png`}
        description="wood button"
        imageHeight={dimensions[size].height}
        imageWidth={dimensions[size].width}
        width={`${width}px`}
        height={`${height}px`}
				resizeMode="fill"
      />
      {overlay ? (
        <hstack
          width="100%"
          height="100%"
          backgroundColor="rgba(138, 97, 51, 0.5)"
        ></hstack>
      ) : null}

      <MyText size={textSize}>
        {label}
      </MyText>
    </zstack>
  );
};