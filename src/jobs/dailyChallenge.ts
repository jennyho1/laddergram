import { Comment, Devvit } from "@devvit/public-api";

import { findOptimalSolution } from "../utils/findOptimalSolution.js";
import { LoadingState } from "../components/LoadingState.js";

export const dailyChallenge = Devvit.addSchedulerJob({
  name: "DAILY_CHALLENGE_JOB",
  onRun: async (_, context) => {
    // get the puzzle of the day from redis
    const date = new Date();
    const key = formatDate(date);

    const words = await context.redis.hGet("dailyChallenges", key);
    if (!words) return;

    const [startWord, targetWord] = words?.split(",") || [];
    const optimal = findOptimalSolution(startWord, targetWord);
    if (optimal === -1) return;

    // create laddergram post
    const subreddit = await context.reddit.getCurrentSubreddit();
    const post = await context.reddit.submitPost({
      title: "Daily Challenge: Can you solve this laddergram?",
      subredditName: subreddit.name,
      preview: LoadingState(),
    });

    // set the post flair
    await context.reddit.setPostFlair({
      postId: post.id,
      subredditName: subreddit.name,
      backgroundColor: "#F48534",
      text: "Daily Challenge",
      textColor: "dark",
    });

    // update database with new post
    await context.redis.hSet(`post:${post.id}`, {
      postId: post.id,
      postType: "daily",
      startWord: startWord.toUpperCase(),
      targetWord: targetWord.toUpperCase(),
      authorUsername: "laddergram",
      optimalSteps: optimal.toString(),
			daily: "true",
      date: Date.now().toString(),
    });

    // make a sticky comment
    let comment: Comment | undefined;
    try {
      comment = await context.reddit.submitComment({
        id: post.id,
        text: `Laddergram is a word ladder puzzle game built on [Reddit's developer platform](https://developers.reddit.com).\nYou start with a word and change one letter at a time to create a new word with each step. Try to reach the target word in the fewest steps possible.\n\n🍀Good luck!🍀`,
      });
    } catch (error) {
      if (error) {
        console.error("Failed to submit sticky comment:", error);
      }
      comment = undefined;
    }
    if (comment) await comment.distinguish(true);

  },
});

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
