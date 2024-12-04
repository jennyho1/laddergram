import { Devvit } from "@devvit/public-api";
import { MyText } from "./MyText.js";

interface StatsBarProps {
  score: string;
  percentage: number;
  count: number;
	barWidth: number;
	star?: boolean;
}

export const StatsBar = (props: StatsBarProps): JSX.Element => {
  const { score, percentage, count, barWidth, star = false } = props;

  return (
    <hstack alignment="middle" width="100%">
      <hstack
        width="58px"
        height="30px"
        backgroundColor="#e2a868"
        alignment="middle center"
      >
				{star ? <text>⭐</text> : null}
        <MyText size={0.5} fillColor="#4e1e15" strokeColor="#e2a868">
          {score}
        </MyText>
				
      </hstack>

      <hstack width="2px" height="30px" backgroundColor="#c77f45"></hstack>

      <vstack>
        <hstack
          width={`${barWidth + 2}px`}
          height="2px"
          backgroundColor="#ffe2bf"
        ></hstack>
        <hstack>
          <hstack
            width={`${barWidth}px`}
            backgroundColor="#e2a868"
            height="10px"
          ></hstack>
          <hstack width="2px" height="10px" backgroundColor="#c77f45"></hstack>
        </hstack>

        <hstack
          width={`${barWidth + 2}px`}
          height="2px"
          backgroundColor="#c77f45"
        ></hstack>
      </vstack>

      <hstack alignment="middle">
        <hstack alignment="center" width="34px">
          <MyText size={0.3} fillColor="#c7ac8b">{`${count}`}</MyText>
        </hstack>
        <hstack alignment="end" width="46px">
          <MyText size={0.5}>{`${percentage}%`}</MyText>
        </hstack>
      </hstack>

      <spacer width="50px" />
    </hstack>
  );

};
