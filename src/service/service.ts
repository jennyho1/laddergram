import type { RedditAPIClient, RedisClient } from "@devvit/public-api";

import type { PostData } from "../types/PostData.js";

// Service that handles the backbone logic for the application
// This service is responsible for:
// * Storing and fetching post data for laddergrams

export class Service {
  readonly redis: RedisClient;
  readonly reddit?: RedditAPIClient;

  constructor(context: { redis: RedisClient; reddit?: RedditAPIClient }) {
    this.redis = context.redis;
    this.reddit = context.reddit;
  }

  /*
   * Submit new laddergram post
   */
  readonly #postDataKey = (postId: string): string => `post:${postId}`;

  async submitLaddergramPost(data: PostData): Promise<void> {
    if (!this.reddit) {
      console.error("submitLaddergramPost: Reddit API client not available");
      return;
    }
    const key = this.#postDataKey(data.postId);

    // Save post object
    await this.redis.hSet(key, {
      postId: data.postId,
      startWord: data.startWord,
      targetWord: data.targetWord,
      authorUsername: data.authorUsername,
      date: Date.now().toString(),
    });
  }

  /*
   * Get laddergram post by postId
   */
  async getLaddergramPost(postId: string): Promise<PostData> {
    const postData = await this.redis.hGetAll(this.#postDataKey(postId));
    return {
      postId: postId,
			startWord: postData.startWord,
			targetWord: postData.targetWord,
      authorUsername: postData.authorUsername,
    };
  }
}
