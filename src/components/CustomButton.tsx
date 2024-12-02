import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface CustomButtonProps {
  label: string;
  width: number;
  height: number;
  onPress: () => void | Promise<void>;
}

export const CustomButton = (props: CustomButtonProps): JSX.Element => {
  const { label, width, height, onPress } = props;

  return (
    <zstack
      width={`${width}px`}
      height={`${height}px`}
      alignment="center middle"
			onPress={onPress}
    >
      <hstack height="100%" width="100%">
        <spacer width="1px" />
        <vstack grow>
          <spacer height="2px" />
          <image
            url="button.png"
            description="logo"
            imageHeight={235}
            imageWidth={500}
            grow
            resizeMode="fill"
          />
          <spacer height="2px" />
        </vstack>
        <spacer width="2px" />
      </hstack>

      <MyText size={0.5} fillColor="#4e1e15" strokeColor="#e2a868">
        {label}
      </MyText>
    </zstack>
  );
};
