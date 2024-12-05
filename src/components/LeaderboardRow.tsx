import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface LeaderboardRowsProps {
  rank: number;
  username: string;
  score: number;
}

export const LeaderboardRows = (props: LeaderboardRowsProps): JSX.Element => {
  const { rank, username, score } = props;
  const height = "36px";
  if (rank < 0)
    return (
      <hstack
        alignment="center middle"
        width="100%"
        height={height}
        backgroundColor="#e2a868"
        border="thin"
        borderColor="#4e1e15"
      ></hstack>
    );

  return (
    <hstack
      alignment="center middle"
      width="100%"
			padding="small"
    >
      <hstack grow>
        <MyText size={0.45}>
          {`${rank}. ${username}`}
        </MyText>
      </hstack>
      <hstack>
        <MyText size={0.45} topMargin="2px">
          {`${score}`}
        </MyText>
        <spacer width="3px" />
        <text>🪜</text>
      </hstack>
    </hstack>
  );
};
