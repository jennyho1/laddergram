import { Devvit, IconName } from "@devvit/public-api";

interface CustomIconProps {
  icon: IconName;
  onPress: () => void | Promise<void>;
}

export const CustomIcon = (props: CustomIconProps): JSX.Element => {
  const { icon, onPress } = props;

  return (
    <zstack alignment="center middle" cornerRadius="full" onPress={onPress} >
      <image
        url="woodCircle.png"
        imageHeight={500}
        imageWidth={500}
        width="33px"
        height="33px"
      />
      <icon name={icon} color="#4e1e15"></icon>
    </zstack>
  );
};
