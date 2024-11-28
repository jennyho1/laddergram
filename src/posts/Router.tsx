import type { Context } from "@devvit/public-api";
import { Devvit, useAsync, useState } from "@devvit/public-api";
import { Service } from "../service/service.js";

import { MenuPost } from "./MenuPost/MenuPost.js";
import { GamePost } from "./GamePost/GamePost.js";
import { KeyboardButton } from "../components/KeyboardButton.js";
import { LetterBlock } from "../components/LetterBlock.js";
import { PostData } from "../types/PostData.js";

/*
 * Page Router
 *
 * This is the post type router and the main entry point for the custom post.
 * It handles the initial data loading and routing to the correct page based on the post type.
 */

export const Router: Devvit.CustomPostComponent = (context: Context) => {
  const service = new Service(context);
  const [page, setPage] = useState("game");

  // Load the post data from Redis
  const { data: postData, loading: postDataLoading } = useAsync<PostData>(
    async () => {
      return await service.getLaddergramPost(context.postId!);
    }
  );

  //return loading
  if (postData === null || postDataLoading || !postData.startWord || !postData.targetWord ) {
    return (
      <vstack alignment="center middle" width="100%" height="100%">
        <text color="global-white">Error: undefined</text>
      </vstack>
    );
  }

	const pages: Record<string, JSX.Element> = {
    menu: (
      <MenuPost
        onPress={() => {
          setPage("game");
        }}
      />
    ),
    game: (
      <GamePost
				postData={postData}
        onInfoPress={() => setPage("menu")}
      />
    ),
    result: (
      <vstack alignment="center middle">
        <text color="global-white">Result Post</text>
      </vstack>
    ),
  };

  /*
   * Return the custom post unit
   */

  return (
    <blocks>
      <zstack
        width="100%"
        height="100%"
        alignment="top start"
        backgroundColor="#013119"
      >
        <image
          imageHeight={1024}
          imageWidth={2048}
          height="100%"
          width="100%"
          url="background.png"
          description="Zigzag green background"
          resizeMode="cover"
        />
        {pages[page] || (
          <vstack alignment="center middle" width="100%" height="100%">
            <text color="global-white">Error: Unknown post type</text>
          </vstack>
        )}
      </zstack>
    </blocks>
  );
};
