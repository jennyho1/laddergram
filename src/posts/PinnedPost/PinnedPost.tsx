import { Devvit, useState } from "@devvit/public-api";
import { UserData } from "../../types/UserData.js";
import { MenuPage } from "./MenuPage.js";

interface PinnedPostProps {
  userData: UserData;
}

export const PinnedPost = (props: PinnedPostProps): JSX.Element => {
  const { userData } = props;
  const [page, setPage] = useState("menu");

  const pages: Record<string, JSX.Element> = {
    menu: <MenuPage />,
    leaderboard: (
      <vstack alignment="center middle" width="100%" height="100%">
        <text color="global-white">Leaderboard</text>
      </vstack>
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
