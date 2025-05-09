import { Context, Devvit, useAsync } from "@devvit/public-api";
import { Service } from "../../service/service.js";
import { LoadingState } from "../../components/LoadingState.js";
import { UserData } from "../../types/UserData.js";
import { SortedSetData } from "../../types/SortedSetData.js";
import { MyText } from "../../components/MyText.js";
import { CustomIcon } from "../../components/CustomIcon.js";
import { LeaderboardRows } from "../../components/LeaderboardRow.js";
import { Container } from "../../components/Container.js";
interface LeaderboardPageProps {
  username: string;
  onClose: () => void;
}

export const LeaderboardPage = (
  props: LeaderboardPageProps,
  context: Context
): JSX.Element => {
  const { username, onClose } = props;
  const service = new Service(context);
  const rowCount = 10;

  const { data, loading } = useAsync<{
    leaderboard: SortedSetData[];
    user: {
      rank: number;
      score: number;
    };
  }>(async () => {
    try {
      return {
        leaderboard: await service.getTotalPoints(rowCount),
        user: await service.getUserPoints(username),
      };
    } catch (error) {
      if (error) {
        console.error("Error loading leaderboard data", error);
      }
      return {
        leaderboard: [],
        user: { rank: -1, score: 0 },
      };
    }
  });

  if (loading || data === null) return <LoadingState />;

  const showUser = data.user.rank > rowCount && data.user.rank != -1;

  const userRow = showUser ? (
    <LeaderboardRows
      rank={data.user.rank}
      username={username}
      score={data.user.score}
    />
  ) : null;

  const rowsToShow = rowCount - (showUser ? 1 : 0);

  const leaderboardRows = data.leaderboard.map((row, index) => {
    if (index >= rowsToShow) {
      return null;
    }
    return (
      <LeaderboardRows
        rank={index + 1}
        username={row.member}
        score={row.score}
      />
    );
  });

  const placeholderRows = Array.from({
    length: rowsToShow - data.leaderboard.length,
  }).map((_value, _index) => (
    <LeaderboardRows
      rank={data.leaderboard.length + 1 + _index}
      username="---"
      score={0}
    />
  ));

  return (
    <vstack width="100%" height="100%" padding="large">
      {/* nav */}
      <hstack gap="medium" alignment="middle center">
        <vstack grow>
          <MyText size={0.6} mode="light">Leaderboard</MyText>
        </vstack>
        <CustomIcon icon="close-fill" onPress={onClose} />
      </hstack>
      <spacer height="16px" />
      <vstack gap="medium" grow>
        <Container>
          {leaderboardRows}
          {placeholderRows}
        </Container>
        {showUser ? <Container>{userRow}</Container> : null}
      </vstack>
    </vstack>
  );
};
