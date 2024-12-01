import { Devvit } from "@devvit/public-api";

interface KeyboardButtonProps {
  onPress: () => void | Promise<void>;
  label: string;
  backgroundColor?: string;
  width?: Devvit.Blocks.SizeString;
}

export const KeyboardButton = (props: KeyboardButtonProps): JSX.Element => {
  const { onPress, label, backgroundColor, width } = props;

  return (
    <vstack
      width={width || "22px"}
      height="22px"
      alignment="center middle"
      backgroundColor={backgroundColor || "#c19b7a"}
      border="thin"
      borderColor="#3a322b"
      onPress={onPress}
    >
      <text color="#3a322b" weight="bold">{label}</text>
    </vstack>
  );
};
