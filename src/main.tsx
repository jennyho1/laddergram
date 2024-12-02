// Learn more at developers.reddit.com/docs
import { Devvit, useState } from "@devvit/public-api";
import { Router } from "./posts/Router.js";
import { Service } from "./service/service.js";
import { LoadingState } from "./components/LoadingState.js";

import words_3letter from "./data/words_3letter.json";
import words_4letter from "./data/words_4letter.json";
import words_5letter from "./data/words_5letter.json";

/*
 * Enable plugins
 */
Devvit.configure({
  redditAPI: true,
  redis: true,
});

/*
 * Define custome post type
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
    const { reddit, ui } = context;
    const service = new Service(context);
    const startWord = event.values.startword.toLowerCase();
    const targetWord = event.values.targetword.toLowerCase();
    // onSubmit handler
    if (startWord.length != targetWord.length) {
      ui.showToast("Invalid: Words have different length");
    } else if (startWord === targetWord) {
      ui.showToast("Invalid: Starting word must be different from target word");
    } else {
      const wordLists: { [key: number]: string[] } = {
        3: words_3letter,
        4: words_4letter,
        5: words_5letter,
      };

      // Check if word length is valid and both words are in the list
      const wordList = wordLists[startWord.length];
      if (!wordList) {
        ui.showToast("Invalid: Unsupported word length");
        return;
      } else if (
        !wordList.includes(startWord) ||
        !wordList.includes(targetWord)
      ) {
        ui.showToast("Invalid: Starting word is not in the word list");
        return;
      }

      // create laddergram post
      const subreddit = await reddit.getCurrentSubreddit();
      const post = await reddit.submitPost({
        title: "Can you solve this laddergram?",
        subredditName: subreddit.name,
        preview: <LoadingState />,
      });

      // update database with new post
      service.saveLaddergramPost({
        postId: post.id,
				postType: "laddergram",
        startWord: startWord.toUpperCase(),
        targetWord: targetWord.toUpperCase(),
        authorUsername: post.authorName,
      });

      context.ui.showToast({
        text: "Sucess: Created laddergram post!",
        appearance: "success",
      });
      context.ui.navigateTo(post);
    }
  }
);

/*
 * Install action
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

export default Devvit;
