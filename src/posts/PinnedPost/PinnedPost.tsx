import { Context, Devvit, useState } from "@devvit/public-api";
import { UserData } from "../../types/UserData.js";
import { MenuPage } from "./MenuPage.js";
import { LeaderboardPage } from "./LeaderboardPage.js";
import { HowToPlayPage } from "./HowToPlayPage.js";

interface PinnedPostProps {
  userData: UserData;
}

export const PinnedPost = (
  props: PinnedPostProps,
  context: Context
): JSX.Element => {
  const { userData } = props;
  const [page, setPage] = useState("menu");

  const pages: Record<string, JSX.Element> = {
    menu: (
      <MenuPage
        screenWidth={context.dimensions?.width}
        userData={userData}
        onNavPress={(page) => {
          setPage(page);
        }}
      />
    ),
    leaderboard: (
      <LeaderboardPage
        userData={userData}
        onClose={() => {
          setPage("menu");
        }}
      ></LeaderboardPage>
    ),
    howtoplay: (
      <HowToPlayPage
				screenWidth={context.dimensions?.width || 288}
        onClose={() => {
          setPage("menu");
        }}
      />
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
