import { Devvit, IconName } from "@devvit/public-api";

interface AlertProps {
  message: string;
  type: string;
}

export const Alert = (props: AlertProps): JSX.Element => {
  const { message, type } = props;

  let borderColor = "rgba(23, 77, 128)";
  let backgroundColor = "rgba(23, 77, 128, 0.7)";
	let iconName: IconName = "error"
  if (type == "error") {
    borderColor = "rgba(143, 0, 0)";
    backgroundColor = "rgba(143, 0, 0, 0.7)";
		iconName = "error"
  } else if (type == "success") {
		borderColor = "rgba(143, 0, 0)";
    backgroundColor = "rgba(143, 0, 0, 0.7)";
		iconName = "error"
	}

  return (
    <vstack width="100%" alignment="top end">
      <spacer height="64px" />
      <hstack>
        <hstack
          padding="small"
          backgroundColor={backgroundColor}
          border="thick"
          borderColor={borderColor}
          cornerRadius="small"
        >
          <icon name={iconName}></icon>
          <spacer width="8px" />
          <text>{message}</text>
        </hstack>
        <spacer width="8px" />
      </hstack>
    </vstack>
  );
};
