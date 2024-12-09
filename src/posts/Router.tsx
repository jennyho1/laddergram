import type { Context } from "@devvit/public-api";
import { Devvit, useAsync, useState } from "@devvit/public-api";
import { Service } from "../service/service.js";

import { LaddergramPost } from "./LaddergramPost/LaddergramPost.js";
import {
  LaddergramPostData,
  PinnedPostData,
  PostData,
} from "../types/PostData.js";
import { UserData, UserPostData } from "../types/UserData.js";
import { LoadingState } from "../components/LoadingState.js";
import { PinnedPost } from "./PinnedPost/PinnedPost.js";

/*
 * Page Router
 *
 * This is the post type router and the main entry point for the custom post.
 * It handles the initial data loading and routing to the correct page based on the post type.
 */

export const Router: Devvit.CustomPostComponent = (context: Context) => {
  const service = new Service(context);

  // get the user's information (code taken from Pixelery source code)
  const { data: username, loading: usernameLoading } = useAsync(
    async () => {
      if (!context.userId) return null; // Return early if no userId
      const userKey = `user:${context.userId}`;
      const username = await context.redis.hGet(userKey, "username");
      if (username) {
        return username;
      } else {
        const user = await context.reddit.getUserById(context.userId);
        if (user) {
          await context.redis.hSet(userKey, {
            username: user.username,
            postCreated: "0",
            lastPostCreatedDate: Date.now().toString(),
          });
          return user.username;
        }
      }
      return null;
    },
    {
      depends: [],
    }
  );

  // Load the post type and data from Redis
  const { data: postData, loading: postDataLoading } = useAsync<
    LaddergramPostData | PinnedPostData
  >(async () => {
    const postType = await service.getPostType(context.postId!);
    switch (postType) {
      case "pinned":
        return await service.getPinnedPost(context.postId!);
      default:
        return await service.getLaddergramPost(context.postId!);
    }
  });

  const { data: userPostData, loading: userPostDataLoading } =
    useAsync<UserPostData>(
      async () => {
        return await service.getUserPostData(username!, context.postId!);
      },
      {
        depends: [username],
      }
    );

  //return loading
  if (
    usernameLoading ||
    postData === null ||
    postDataLoading ||
    userPostData === null ||
    userPostDataLoading
  ) {
    return <LoadingState />;
  }

  const postType = postData.postType;
  const postTypes: Record<string, JSX.Element> = {
    laddergram: (
      <LaddergramPost
        postData={postData as LaddergramPostData}
        userPostData={userPostData}
      />
    ),
    pinned: <PinnedPost username={username || ""} />,
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
        {postTypes[postType] || (
          <vstack alignment="center middle" width="100%" height="100%">
            <text color="global-white">Error: Unknown post type</text>
          </vstack>
        )}
      </zstack>
    </blocks>
  );
};
