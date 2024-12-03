import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface StatsBarProps {
  score: string;
  percentage: number;
  count: number;
}

export const StatsBar = (props: StatsBarProps): JSX.Element => {
  const { score, percentage, count } = props;
  const height = "42px";

  return (
    <zstack>
      <hstack
        backgroundColor="rgba(78, 30, 21)"
        width={`${percentage}%`}
        height={height}
        cornerRadius="small"
      ></hstack>
      <hstack
        backgroundColor="rgba(78, 30, 21, 0.5)"
        width="100%"
        height={height}
        cornerRadius="small"
        alignment="center middle"
      >
        <spacer width="12px" />
        <hstack grow>
          <MyText size={0.55} topMargin="5px">{score == "" ? "" : `${score} steps`}</MyText>
        </hstack>
        <hstack alignment="bottom">
          <MyText size={0.4} fillColor="#c7ac8b">
            {count ? `${count}` : ""}
          </MyText>
          <spacer width="16px" />
          <MyText size={0.55}>{percentage ? `${percentage}%` : ""}</MyText>
          <spacer width="12px" />
        </hstack>
      </hstack>
    </zstack>
  );
};
