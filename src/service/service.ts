import {
  Comment,
  RedditAPIClient,
  RedisClient,
  UIClient,
} from "@devvit/public-api";

import type { PostData } from "../types/PostData.js";
import type { SolvedResultData } from "../types/SolvedResultData.js";
import { UserData } from "../types/UserData.js";
import { Status } from "../types/Status.js";
import { SortedSetData } from "../types/SortedSetData.js";
import { PostResults } from "../types/PostResults.js";

// Service that handles the backbone logic for the application
// This service is responsible for:
// * Storing and fetching post data for laddergrams

export class Service {
  readonly redis: RedisClient;
  readonly reddit?: RedditAPIClient;
  readonly ui: UIClient;

  constructor(context: {
    redis: RedisClient;
    reddit?: RedditAPIClient;
    ui: UIClient;
  }) {
    this.redis = context.redis;
    this.reddit = context.reddit;
    this.ui = context.ui;
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
	readonly #postTriesKey = (postId: string): string => `tries:${postId}`;
  readonly #postResultKey = (postId: string): string => `result:${postId}`;
  readonly #postScoretKey = (postId: string): string => `score:${postId}`;

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

    // increment the number of people who got this score
    await this.redis.zIncrBy(
      this.#postScoretKey(data.postId),
      data.score.toString(),
      1
    );
  }

  async submitTried(postId: string, username: string): Promise<void> {
    await this.redis.zAdd(this.#postTriesKey(postId), {
      member: username,
      score: 0,
    });
  }

  async getScoreDistribution(postId: string): Promise<PostResults> {
    const data = await this.redis.zRange(this.#postScoretKey(postId), 0, 5, {
      by: "rank",
    });
    const playerCount = await this.redis.zCard(this.#postTriesKey(postId));
    const solvedCount = await this.redis.zCard(this.#postSolvedKey(postId));

    const parsedData: PostResults = {
      scores: {},
      playerCount: playerCount,
      solvedCount: solvedCount,
    };

    data.forEach((value) => {
      const { member: score, score: count } = value;
      parsedData.scores[score] = count;
    });

    return parsedData;
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

  /*
   * Submit Comment
   */
  readonly #commentKey = (postId: string) => `comments:${postId}`;

  async submitComment(postId: string, userData: UserData): Promise<Status> {
    if (!this.reddit) {
      console.error("Reddit API client not available in Service");
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }

    const postCommentKey = this.#commentKey(postId);

    // check if comment had already been submitted
    const submitted = !!(await this.redis.zScore(
      postCommentKey,
      userData.username
    ));
    if (submitted)
      return {
        success: false,
        message: "You already left a comment for this laddergram.",
      };

    let comment: Comment | undefined;
    try {
      comment = await this.reddit.submitComment({
        id: postId,
        text: `u/${userData.username} solved this in ${userData.score} step${
          userData.score > 1 ? "s" : ""
        }: ${userData.result}`,
      });
    } catch (error) {
      if (error) {
        console.error("Failed to submit comment:", error);
      }
      comment = undefined;
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }

    // save the fact that user commented
    await this.redis.zAdd(postCommentKey, {
      member: userData.username,
      score: 1,
    });

    this.ui.navigateTo(comment);

    return {
      success: true,
      message: "",
    };
  }
}
