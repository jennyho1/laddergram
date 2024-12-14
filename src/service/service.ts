import {
  Comment,
  RedditAPIClient,
  RedisClient,
  UIClient,
  ZRangeOptions,
} from "@devvit/public-api";

import type {
  LaddergramPostData,
  PinnedPostData,
  PostData,
} from "../types/PostData.js";
import type { SolvedResultData } from "../types/SolvedResultData.js";
import { UserData, UserPostData } from "../types/UserData.js";
import { Status } from "../types/Status.js";
import { SortedSetData } from "../types/SortedSetData.js";
import { PostResults } from "../types/PostResults.js";
import { isToday } from "../utils/isToday.js";

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

  /************************************************************************
   * All keys
   ************************************************************************/

  /**Hashmap for storing the post data of postId
   * - postId (string)
   * - postType (string) = "laddergram" or "pinned" or "daily"
   * - startWord (string)
   * - targetWord (string)
   * - authorUsername (string)
   * - optimalSteps: (number)
   * - date: (string)
   */
  readonly #postDataKey = (postId: string): string => `post:${postId}`;

  /**Sorted set for tracking the score of each user for a given post
   * - member: username (string)
   * - score: score (0 if player tried but didn't solve, else 0< that represents the user's score)
   */
  readonly #postScoreKey = (postId: string): string => `score:${postId}`;

  /**Hashmap for storing the player's answer result for a post
   * - [username] = stringified result (like "HOT -> DOT -> DOG	")
   */
  readonly #postResultKey = (postId: string): string => `result:${postId}`;

  /**Sorted set for tracking the number of people who scored the same on a given post
   * - member: score
   * - score: # of people who got that score
   */
  readonly #postScoreStatsKey = (postId: string): string =>
    `scoreStats:${postId}`;

  /**Sorted set for tracking the total points that a user has
   * - member: username
   * - score: total points
   */
  readonly #totalPointsKey = (): string => `points`;

  /**Hashmap for storing user information
   * - username (string)
   * - postCreated (number)
   * - lastPostCreatedDate (string)
   */
  readonly #userDataKey = (username: string) => `users:${username}`;

  /**Hashmap to keep track of who commented on the given post
   * - [username] = "1"
   */
  readonly #commentKey = (postId: string) => `comments:${postId}`;

  /************************************************************************
   * Post Data
   ************************************************************************/
  async getPostType(postId: string): Promise<string> {
    const key = this.#postDataKey(postId);
    const postType = await this.redis.hGet(key, "postType");
    return postType ?? "laddergram";
  }

  /*
   * Laddergram Post
   */
  async saveLaddergramPost(data: LaddergramPostData): Promise<void> {
    const key = this.#postDataKey(data.postId);
    await this.redis.hSet(key, {
      postId: data.postId,
      postType: data.postType,
      startWord: data.startWord,
      targetWord: data.targetWord,
      authorUsername: data.authorUsername,
      optimalSteps: data.optimalSteps.toString(),
      date: Date.now().toString(),
    });
  }

  async getLaddergramPost(postId: string): Promise<LaddergramPostData> {
    const postData = await this.redis.hGetAll(this.#postDataKey(postId));
    return {
      postId: postId,
      postType: postData.postType,
      startWord: postData.startWord,
      targetWord: postData.targetWord,
      authorUsername: postData.authorUsername,
      optimalSteps: parseInt(postData.optimalSteps) || 0,
    };
  }

  /*
   * Pinned Post
   */
  async savePinnedPost(postId: string): Promise<void> {
    const key = this.#postDataKey(postId);
    await this.redis.hSet(key, {
      postId: postId,
      postType: "pinned",
    });
  }

  async getPinnedPost(postId: string): Promise<PinnedPostData> {
    const key = this.#postDataKey(postId);
    const postType = await this.redis.hGet(key, "postType");
    return {
      postId: postId,
      postType: postType ?? "pinned",
    };
  }

  /************************************************************************
   * Post Score, Results, and Stats
   ************************************************************************/
  async submitSolvedResult(data: SolvedResultData): Promise<void> {
    // Save user's score
    await this.redis.zAdd(this.#postScoreKey(data.postId), {
      member: data.username,
      score: data.score,
    });

    // Save the user's result of the game
    await this.redis.hSet(this.#postResultKey(data.postId), {
      [data.username]: data.result,
    });

    // add to their total points
    let points = 0;
    if (data.wordLength == 3) points = 2;
    else if (data.wordLength == 4) points = 4;
    else if (data.wordLength == 5) points = 8;
		if (data.daily) points += 10;
    await this.redis.zIncrBy(this.#totalPointsKey(), data.username, points);

    // increment the number of people who got this score
    await this.redis.zIncrBy(
      this.#postScoreStatsKey(data.postId),
      data.score.toString(),
      1
    );
  }

  async submitTried(postId: string, username: string): Promise<void> {
    await this.redis.zAdd(this.#postScoreKey(postId), {
      member: username,
      score: 0,
    });
  }

  async getPostResults(
    postId: string,
    optimal: number,
    rowCount: number = 10
  ): Promise<PostResults> {
    const scoreKey = this.#postScoreKey(postId);
    const scoreStatsKey = this.#postScoreStatsKey(postId);

    const statsData = await this.redis.zScan(scoreStatsKey, 0);
    const playerCount = await this.redis.zCard(scoreKey);
    const failedCount = (
      await this.redis.zRange(scoreKey, 0, 0, {
        by: "score",
      })
    ).length;
    const solvedCount = playerCount - failedCount;

    // parse and order the data for scores stats
    const scores = statsData.members.sort(
      (a, b) => Number(a.member) - Number(b.member)
    );

    const bestScore = scores.length > 0 ? Number(scores[0].member) : optimal;

    // Define required members
    const requiredMembers = Array.from({ length: rowCount - 1 }, (_, index) =>
      (bestScore + index).toString()
    );
    const scoreMapping = Object.fromEntries(
      scores.map((item) => [item.member, item.score])
    );

    // Fill missing members and initialize their score to 0
    const filledData = requiredMembers.map((member) => ({
      member,
      score: scoreMapping[member] || 0,
    }));

    const accumulatedNumber = bestScore + rowCount - 1;
    // Accumulate the remaining members into "+"
    const remaining = scores.filter(
      (item) => Number(item.member) >= accumulatedNumber
    );
    const accumulated = remaining.reduce(
      (acc, item) => ({
        member: `${accumulatedNumber}+`,
        score: acc.score + item.score,
      }),
      { member: `${accumulatedNumber}+`, score: 0 } // Initial accumulator
    );

    // Combine the filled data and the accumulated data
    const parsedScore = [...filledData, accumulated];
    const parsedData: PostResults = {
      scores: parsedScore,
      playerCount: playerCount,
      solvedCount: solvedCount,
    };

    return parsedData;
  }

  /************************************************************************
   * User Result and Data
   ************************************************************************/
  async updateUserData(username: string): Promise<void> {
    const userKey = this.#userDataKey(username);
    const userData = await this.redis.hGetAll(userKey);
    if (isToday(userData.lastPostCreatedDate)) {
      await this.redis.hIncrBy(userKey, "postCreated", 1);
    } else {
      await this.redis.hSet(userKey, {
        postCreated: "1",
        lastPostCreatedDate: Date.now().toString(),
      });
    }
  }

  async getUserData(username: string): Promise<UserData> {
    const userKey = this.#userDataKey(username);
    const userData = await this.redis.hGetAll(userKey);
		if (!userData) {
			await this.redis.hSet(userKey, {
				username: username,
        postCreated: "0",
        lastPostCreatedDate: Date.now().toString(),
      });
		}
    return {
      username: username,
      postCreated: parseInt(userData.postCreated || "0"),
      lastPostCreatedDate: userData.lastPostCreatedDate || Date.now().toString(),
    };
  }

  async getUserPostData(
    username: string,
    postId: string
  ): Promise<UserPostData> {
    const score = await this.redis.zScore(this.#postScoreKey(postId), username);
    const result = await this.redis.hGet(this.#postResultKey(postId), username);

    const parsedData: UserPostData = {
      username,
      solved: !!score && score != 0,
      score: score ? score : 0,
      result: result ? result : "",
    };
    return parsedData;
  }

  /************************************************************************
   * Comments
   ************************************************************************/
  async submitComment(
    postId: string,
    userPostData: UserPostData
  ): Promise<Status> {
    if (!this.reddit) {
      console.error("Reddit API client not available in Service");
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }

    const commentKey = this.#commentKey(postId);

    // check if comment had already been submitted
    const submitted = !!(await this.redis.hGet(
      commentKey,
      userPostData.username
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
        text: `u/${userPostData.username} solved this in ${
          userPostData.score
        } step${userPostData.score > 1 ? "s" : ""}: ${userPostData.result}`,
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
    await this.redis.hSet(commentKey, {
      [userPostData.username]: "1"
    });

    this.ui.navigateTo(comment);

    return {
      success: true,
      message: "",
    };
  }

  /************************************************************************
   * Total Points (this code snippet is taken from pixelry)
   ************************************************************************/
  async getTotalPoints(maxLength: number = 10): Promise<SortedSetData[]> {
    const options: ZRangeOptions = { reverse: true, by: "rank" };
    return await this.redis.zRange(
      this.#totalPointsKey(),
      0,
      maxLength - 1,
      options
    );
  }

  async getUserPoints(username: string | null): Promise<{
    rank: number;
    score: number;
  }> {
    const defaultValue = { rank: -1, score: 0 };
    if (!username) return defaultValue;
    try {
      const [rank, score, total] = await Promise.all([
        this.redis.zRank(this.#totalPointsKey(), username),
        // TODO: Remove .zScore when .zRank supports the WITHSCORE option
        this.redis.zScore(this.#totalPointsKey(), username),
        this.redis.zCard(this.#totalPointsKey()),
      ]);
      return {
        rank: rank === undefined ? -1 : total - rank,
        score: score === undefined ? 0 : score,
      };
    } catch (error) {
      if (error) {
        console.error("Error fetching user score board entry", error);
      }
      return defaultValue;
    }
  }
}
