import { Devvit } from "@devvit/public-api";

interface StatsBarProps {
  score: string;
  percentage: number;
  count: number;
}

export const StatsBar = (props: StatsBarProps): JSX.Element => {
  const { score, percentage, count } = props;

  return (
    <zstack>
      <hstack
        backgroundColor="rgba(0, 72, 115)"
        width={`${percentage}%`}
        height="42px"
        cornerRadius="small"
      ></hstack>
      <hstack
        backgroundColor="rgba(0, 72, 115, 0.4)"
        width="100%"
        height="42px"
        cornerRadius="small"
        alignment="center middle"
      >
        <spacer width="12px" />
        <text size="xlarge" color="white" weight="bold" grow>
          {score == "" ? "" : `${score} steps`}
        </text>
        <text size="small" color="rgba(255, 255, 255, 0.6)" weight="bold" >
          {count || ""}
        </text>
        <spacer width="16px" />
        <text size="xlarge" weight="bold" color="white">{percentage ? `${percentage}%` : ""}</text>
        <spacer width="12px" />
      </hstack>
    </zstack>
  );
};
