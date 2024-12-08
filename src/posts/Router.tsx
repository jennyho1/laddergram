import type { Context } from "@devvit/public-api";
import { Devvit, useAsync, useState } from "@devvit/public-api";
import { Service } from "../service/service.js";

import { LaddergramPost } from "./LaddergramPost/LaddergramPost.js";
import {
  LaddergramPostData,
  PinnedPostData,
  PostData,
} from "../types/PostData.js";
import { UserData } from "../types/UserData.js";
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
      const cacheKey = "cache:userId-username";
      const cache = await context.redis.hGet(cacheKey, context.userId);
      if (cache) {
        return cache;
      } else {
        const user = await context.reddit.getUserById(context.userId);
        if (user) {
          await context.redis.hSet(cacheKey, {
            [context.userId]: user.username,
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
  const { data: userData, loading: userDataLoading } = useAsync<UserData>(
    async () => {
      return await service.getUserData(username!, context.postId!);
    },
    {
      depends: [username],
    }
  );

  // Load the post data from Redis
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

  //return loading
  if (
    usernameLoading ||
    postData === null ||
    postDataLoading ||
    userData === null ||
    userDataLoading
  ) {
    return <LoadingState />;
  }

  const postType = postData.postType;
  const postTypes: Record<string, JSX.Element> = {
    laddergram: (
      <LaddergramPost
        postData={postData as LaddergramPostData}
        userData={userData}
      />
    ),
    pinned: (<PinnedPost userData={userData}/>),
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
