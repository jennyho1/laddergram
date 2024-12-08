// Learn more at developers.reddit.com/docs
import { Devvit, useState } from "@devvit/public-api";
import { Router } from "./posts/Router.js";
import { Service } from "./service/service.js";
import { LoadingState } from "./components/LoadingState.js";

import { scheduleDailyChallengeForm } from "./forms/scheduleDailyChallengeForm.js";
import { validateLaddergram } from "./utils/validateLaddergram.js";
import { findOptimalSolution } from "./utils/findOptimalSolution.js";

/*
 * Enable plugins
 */
Devvit.configure({
  redditAPI: true,
  redis: true,
});

/*
 * Jobs
 */
// import './jobs/dailyChallenge.js';

/*
 * Define custom post type
 */
Devvit.addCustomPostType({
  name: "Laddergram Post",
  height: "tall",
  render: Router,
});

const newGameForm = Devvit.createForm(
  {
    title: "Add New Laddergram Game",
    description: "Both words must be the same length and have 3-5 letters.",
    fields: [
      {
        type: "string",
        name: "startword",
        label: "Starting Word",
        required: true,
      },
      {
        type: "string",
        name: "targetword",
        label: "Target Word",
        required: true,
      },
    ],
    acceptLabel: "Create",
    cancelLabel: "Cancel",
  },
  async (event, context) => {
    const service = new Service(context);
    const startWord = event.values.startword.toLowerCase();
    const targetWord = event.values.targetword.toLowerCase();
		const optimalSolution = findOptimalSolution(startWord, targetWord);
		console.log(`${startWord} to ${targetWord}: ${optimalSolution} steps`)

    // const status = validateLaddergram(startWord, targetWord);
    // if (!status.success) {
    //   context.ui.showToast(status.message);
    //   return;
    // }

    // // create laddergram post
    // const subreddit = await context.reddit.getCurrentSubreddit();
    // const post = await context.reddit.submitPost({
    //   title: "Can you solve this laddergram?",
    //   subredditName: subreddit.name,
    //   preview: <LoadingState />,
    // });

    // // update database with new post
    // service.saveLaddergramPost({
    //   postId: post.id,
    //   postType: "laddergram",
    //   startWord: startWord.toUpperCase(),
    //   targetWord: targetWord.toUpperCase(),
    //   authorUsername: post.authorName,
    // });

    // context.ui.showToast({
    //   text: "Sucess: Created laddergram post!",
    //   appearance: "success",
    // });
    // context.ui.navigateTo(post);
  }
);

/*
 * Install actions
 */
Devvit.addMenuItem({
  label: "[Laddergram] Add New Post",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    context.ui.showForm(newGameForm);
  },
});

Devvit.addMenuItem({
  label: "[Laddergram] New Pinned Post",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const service = new Service(context);
    const community = await context.reddit.getCurrentSubreddit();
    const post = await context.reddit.submitPost({
      title: "Let's Play Laddergram!",
      subredditName: community.name,
      preview: <LoadingState />,
    });
    await post.sticky();
    await service.savePinnedPost(post.id);
    context.ui.navigateTo(post);
  },
});

Devvit.addMenuItem({
  label: "[Laddergram] Schedule daily challenges",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    context.ui.showForm(scheduleDailyChallengeForm);
  },
});

Devvit.addMenuItem({
  label: "[Laddergram] Stop daily challenges",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    // get the jobId from redis
    const jobId = await context.redis.get("dailyChallengeJobId");
    if (!jobId) {
      context.ui.showToast("No daily challenges are currently running.");
      return;
    }
    // stop the job and remove jobId from redis
    await context.scheduler.cancelJob(jobId);
    await context.redis.del("dailyChallengeJobId");
  },
});

export default Devvit;
