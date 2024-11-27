// Learn more at developers.reddit.com/docs
import { Devvit, useState } from "@devvit/public-api";

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new laddergram post
Devvit.addMenuItem({
  label: "Add new laddergram",
  location: "subreddit",
  forUserType: "moderator",
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      title: "Laddergram #",
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: "Created laddergram post!" });
  },
});


// Add a post type definition
Devvit.addCustomPostType({
  name: "Laddergram Post",
  height: "tall",
  render: (_context) => {
    return (
      <blocks>
        <zstack alignment="center middle" backgroundColor="#7dffc9" grow>
          <image
            imageHeight={1024}
            imageWidth={1500}
            height="100%"
            width="100%"
            url="background.png"
            description="Striped blue background"
            resizeMode="cover"
          />
          <vstack alignment="center middle" padding="medium" gap="large">
            <image
              url="logo.png"
              description="logo"
              imageHeight={500}
              imageWidth={500}
              height="64px"
              width="64px"
            />
            <vstack alignment="center middle" gap="medium">
              <text size="xxlarge" weight="bold">
                Laddergram
              </text>
              <text alignment="center" maxWidth="250px" wrap>
                Start with a word and change one letter at a time to create a
                new word with each step. The goal is to reach the target word in
                the fewest steps possible.
              </text>
            </vstack>
            <button appearance="bordered">Solve laddergram</button>
          </vstack>
        </zstack>
      </blocks>
    );
  },
});

export default Devvit;
