import { Context, Devvit, useState } from "@devvit/public-api";
import { UserData } from "../../types/UserData.js";
import { MenuPage } from "./MenuPage.js";
import { LeaderboardPage } from "./LeaderboardPage.js";

interface PinnedPostProps {
  userData: UserData;
}

export const PinnedPost = (
  props: PinnedPostProps,
  context: Context
): JSX.Element => {
  const { userData } = props;
  const [page, setPage] = useState("leaderboard");

  const pages: Record<string, JSX.Element> = {
    menu: (
      <MenuPage screenWidth={context.dimensions?.width} userData={userData} onNavPress={(page) => {
				setPage(page);
			}}/>
    ),
    leaderboard: (
      <LeaderboardPage
        userData={userData}
        onClose={() => {
          setPage("menu");
        }}
      ></LeaderboardPage>
    ),
    myStats: (
      <vstack alignment="center middle" width="100%" height="100%">
        <text color="global-white">My stats</text>
      </vstack>
    ),
  };

  /*
   * Return the custom post unit
   */
  return (
    pages[page] || (
      <vstack alignment="center middle" width="100%" height="100%">
        <text color="global-white">Error: Unknown page</text>
      </vstack>
    )
  );
};
