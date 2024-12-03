import { Context, Devvit, useAsync } from "@devvit/public-api";
import { Service } from "../../service/service.js";
import { LoadingState } from "../../components/LoadingState.js";
import { StatsBar } from "../../components/StatsBar.js";
import { UserData } from "../../types/UserData.js";
import { PostResults } from "../../types/PostResults.js";
import { CustomIcon } from "../../components/CustomIcon.js";
import { MyText } from "../../components/MyText.js";

interface StatisticsPageProps {
  onNavPress: (page: string) => void;
}

export const StatisticsPage = (
  props: StatisticsPageProps,
  context: Context
): JSX.Element => {
  const { onNavPress } = props;

  const service = new Service(context);
  const rowCount = 6;

  const { data, loading } = useAsync<PostResults>(
    async () => {
      return await service.getScoreDistribution(context.postId!);
    },
    {
      depends: [],
    }
  );

  if (loading || data === null) return <LoadingState />;

  // const topGuesses = Object.entries(data.scores)
  //   .sort((a, b) => b[1] - a[1])
  //   .map(([score, count]) => {
  //     const percentage = Math.round((count / data.playerCount) * 100);
  //     return <StatsBar score={score} percentage={percentage} count={count} />;
  //   });

  const topGuesses = [
    <StatsBar score={"3"} percentage={56} count={44} />,
    <StatsBar score={"4"} percentage={24} count={23} />,
    <StatsBar score={"5"} percentage={11} count={7} />,
    <StatsBar score={"6"} percentage={9} count={3} />,
  ];

  // Add placeholder rows if there are less guesses than rowCount
  const placeholderRows = Array.from({
    length: rowCount - topGuesses.length,
  }).map((_value, _index) => <StatsBar score="" percentage={0} count={0} />);

  return (
    <vstack width="100%" height="100%" padding="large">
      {/* nav */}
      <hstack gap="medium" alignment="top center">
        <vstack grow>
          <MyText size={0.6}>Score Distribution</MyText>
					<spacer height="5px"/>
          <hstack alignment="bottom">
            <text>👥</text>
            <MyText size={0.35} fillColor="#c7ac8b">{` ${
              data.playerCount
            } player${data.playerCount > 1 ? "s" : ""} tried`}</MyText>
						<spacer width="8px"/>
            <text color="#c7ac8b">• 🏆</text>
            <MyText size={0.35} fillColor="#c7ac8b">{` ${
              data.solvedCount
            } player${data.solvedCount > 1 ? "s" : ""} solved`}</MyText>
          </hstack>
        </vstack>
        <CustomIcon icon="close-fill" onPress={() => onNavPress("game")} />
      </hstack>

      <spacer height="16px" />

      <vstack gap="small" grow>
        {topGuesses}
        {placeholderRows}
      </vstack>
    </vstack>
  );
};
