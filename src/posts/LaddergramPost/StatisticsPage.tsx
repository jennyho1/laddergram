import { Context, Devvit, useAsync } from "@devvit/public-api";
import { Service } from "../../service/service.js";
import { LoadingState } from "../../components/LoadingState.js";
import { StatsBar } from "../../components/StatsBar.js";
import { UserPostData } from "../../types/UserData.js";
import { PostResults } from "../../types/PostResults.js";
import { CustomIcon } from "../../components/CustomIcon.js";
import { MyText } from "../../components/MyText.js";
import { PostData } from "../../types/PostData.js";

interface StatisticsPageProps {
  postData: PostData;
	solved: boolean;
	score: number;
  onNavPress: (page: string) => void;
}

export const StatisticsPage = (
  props: StatisticsPageProps,
  context: Context
): JSX.Element => {
  const { postData, solved, score, onNavPress } = props;

  const service = new Service(context);
  const rowCount = 10;
  // max width is screen width - padding - step number container - bar border - count - percentage
  const maxWidth = (context.dimensions?.width || 288) - 64 - 62 - 2 - 34 - 46;

  const { data, loading } = useAsync<PostResults>(
    async () => {
      return await service.getPostResults(postData.postId, postData.optimalSteps, rowCount);
    },
    {
      depends: [],
    }
  );

  if (loading || data === null) return <LoadingState />;

  const highestCount = data.scores.reduce(
    (max, item) => (item.score > max ? item.score : max),
    0
  );

  const topGuessesRows = data.scores.map((item) => {
    const width = (item.score / highestCount) * maxWidth;
    const star =
      solved &&
      (score == parseInt(item.member) ||
        (item.member.endsWith("+") && score >= parseInt(item.member)));
    return (
      <StatsBar
        score={item.member}
        percentage={
          data.solvedCount
            ? Math.round((item.score / data.solvedCount) * 100)
            : 0
        }
        count={item.score}
        barWidth={width}
        star={star}
      />
    );
  });

  // ---------------------------for testing purposes-----------------------
  // const testData = [
  //   { member: "3", score: 30 },
  //   { member: "4", score: 47 },
  //   { member: "5", score: 18 },
  //   { member: "6", score: 15 },
  //   { member: "7", score: 3 },
  //   { member: "8", score: 5 },
  //   { member: "10", score: 1 },
  //   { member: "11", score: 3 },
  //   { member: "12", score: 5 },
  //   { member: "13", score: 1 },
  // ];
  // const topGuessesRows = testData.map((item) => {
  //   const width = (item.score / 47) * maxWidth;
  //   return (
  //     <StatsBar
  //       score={item.member}
  //       percentage={Math.round((item.score / 119) * 100)}
  //       count={item.score}
  //       barWidth={width}
  //     />
  //   );
  // });
  // -----------------------------------------------------------------------

  return (
    <vstack width="100%" height="100%" padding="large">
      {/* nav */}
      <vstack>
        <hstack alignment="middle center">
          <vstack grow>
            <MyText size={0.6} mode="light">Score Distribution</MyText>
          </vstack>
          <CustomIcon icon="close-fill" onPress={() => onNavPress("game")} />
        </hstack>
        <vstack>
          <hstack alignment="bottom">
            <text>👥</text>
            <MyText size={0.35} mode="med">{` ${
              data.playerCount
            } player${data.playerCount > 1 ? "s" : ""} tried`}</MyText>
            <spacer width="8px" />
            <text color="#c7ac8b">• 🏆</text>
            <MyText size={0.35} mode="med">{` ${
              data.solvedCount
            } player${data.solvedCount > 1 ? "s" : ""} solved`}</MyText>
          </hstack>
          <spacer height="4px" />
          <MyText
            size={0.35}
            mode="med"
          >{`Posted by u/${postData.authorUsername}`}</MyText>
        </vstack>
      </vstack>

      <spacer height="16px" />

      <hstack grow>
        <vstack
          backgroundColor="#ffe2bf"
          width="2px"
          height={`${topGuessesRows.length * 30 + 6 + 30}px`}
        ></vstack>
        <vstack>
          <vstack backgroundColor="#ffe2bf" width="60px" height="2px"></vstack>
          <hstack alignment="middle">
            <hstack
              width="58px"
              height="30px"
              backgroundColor="#e2a868"
              alignment="middle center"
            >
              <MyText size={0.45}>
                Steps
              </MyText>
            </hstack>
            <vstack
              backgroundColor="#c77f45"
              width="2px"
              height="30px"
            ></vstack>
						<spacer width="15px"/>
						<MyText mode="med">{`Optimal: ${postData.optimalSteps} steps`}</MyText>
          </hstack>
          <vstack backgroundColor="#c77f45" width="60px" height="2px"></vstack>
          {topGuessesRows}
          <vstack backgroundColor="#c77f45" width="60px" height="2px"></vstack>
        </vstack>
      </hstack>
    </vstack>
  );
};
