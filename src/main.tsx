// Learn more at developers.reddit.com/docs
import { Devvit, useState } from "@devvit/public-api";
import { Router } from './posts/Router.js';
import { Service } from "./service/service.js";

import words_3letter from './data/words_3letter.json';
import words_4letter from './data/words_4letter.json';
import words_5letter from './data/words_5letter.json';

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
  render: Router
});

const newGameForm = Devvit.createForm(
  {
    title: "Add New Laddergram Game",
    description:
      "Both words must be the same length and have 3-5 letters.",
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
		const service = new Service(context)
		const startWord = event.values.startword;
		const targetWord = event.values.targetword;
    // onSubmit handler
    if (startWord.length != targetWord.length) {
      ui.showToast("Invalid: Words have different length");
    } else if (startWord.length > 5 || startWord.length <= 2) {
      ui.showToast("Invalid: Words must be 3-5 letters");
    } else if (startWord === targetWord) {
			ui.showToast("Invalid: Starting word must be different from target word");
		} else {
			if (startWord.length === 3) {
				if (!words_3letter.includes(startWord)){
					ui.showToast("Invalid: Starting word is not a valid word");
					return;
				}
				if (!words_3letter.includes(targetWord)){
					ui.showToast("Invalid: Target word is not a valid word");
					return;
				}
			} else if (startWord.length === 4) {
				if (!words_4letter.includes(startWord)){
					ui.showToast("Invalid: Starting word is not a valid word");
					return;
				}
				if (!words_4letter.includes(targetWord)){
					ui.showToast("Invalid: Target word is not a valid word");
					return;
				}
			} else if (startWord.length === 5) {
				if (!words_5letter.includes(startWord)){
					ui.showToast("Invalid: Starting word is not a valid word");
					return;
				}
				if (!words_5letter.includes(targetWord)){
					ui.showToast("Invalid: Target word is not a valid word");
					return;
				}
			}

			// create laddergram post
      const subreddit = await reddit.getCurrentSubreddit();
      const post = await reddit.submitPost({
        title: "Can you solve this laddergram?",
        subredditName: subreddit.name,
        // The preview appears while the post loads
        preview: (
          <vstack height="100%" width="100%" alignment="middle center">
            <text size="large">Loading ...</text>
          </vstack>
        ),
      });

			// update database with new post
			service.submitLaddergramPost({
				postId: post.id,
				startWord: startWord,
				targetWord: targetWord,
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
  label: "[Laddergram] Add new post",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    context.ui.showForm(newGameForm);
  },
});




export default Devvit;
