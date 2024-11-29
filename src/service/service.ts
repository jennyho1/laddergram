import type { RedditAPIClient, RedisClient } from "@devvit/public-api";

import type { PostData } from "../types/PostData.js";
import type { SolvedResultData } from "../types/SolvedResultData.js";
import { UserData } from "../types/UserData.js";

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

  /*
   * Solved posts: username and result
   */
  readonly #postSolvedKey = (postId: string): string => `solved:${postId}`;
	readonly #postResultKey = (postId: string): string => `result:${postId}`;

  async submitSolvedResult(data: SolvedResultData): Promise<void> {
    const solvedKey = this.#postSolvedKey(data.postId);
		const resultKey = this.#postResultKey(data.postId);

    // Save solved result object
    await this.redis.zAdd(solvedKey, {
      member: data.username,
      score: data.score,
    });

		// save the user's result of the game
    await this.redis.hSet(resultKey, { [data.username]: data.result });

  }

  /*
   * User Data and State Persistence
   */

  readonly #userDataKey = (username: string) => `users:${username}`;

  async saveUserData(
    username: string,
    data: { [field: string]: string | number | boolean }
  ): Promise<void> {
    const key = this.#userDataKey(username);
    const stringConfig = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value)])
    );
    await this.redis.hSet(key, stringConfig);
  }

  async getUserData(username: string, postId: string): Promise<UserData> {
    const data = await this.redis.hGetAll(this.#userDataKey(username));
    const score = await this.redis.zScore(
      this.#postSolvedKey(postId),
      username
    );
		const result = await this.redis.hGet(this.#postResultKey(postId), username);

    const parsedData: UserData = {
      username,
			solved: !!score,
      score: score ? score : 0,
      result: result ? result : "",
    };
    return parsedData;
  }
}
