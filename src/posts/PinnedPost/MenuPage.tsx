import { Comment, Context, Devvit, useForm  } from "@devvit/public-api";
import { CustomButton } from "../../components/CustomButton.js";
import { MenuButton } from "../../components/MenuButton.js";
import { Service } from "../../service/service.js";
import { LoadingState } from "../../components/LoadingState.js";
import { validateLaddergram } from "../../utils/validateLaddergram.js";
import { UserData } from "../../types/UserData.js";
interface MenuPageProps {
  screenWidth?: number;
	userData: UserData,
	onNavPress: (page: string) => void;
}

export const MenuPage = (props: MenuPageProps,
  context: Context): JSX.Element => {
  const { screenWidth = 400, userData, onNavPress } = props;
	const service = new Service(context);
  const titleLogoWidth = screenWidth < 400 ? screenWidth - 64 : 400;

  const newGameForm = useForm(
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
    async (values) => {
			// onSubmit handler
      const startWord = values.startword.toLowerCase();
      const targetWord = values.targetword.toLowerCase();
			
      const status = validateLaddergram(startWord, targetWord);
      if (!status.success) {
        context.ui.showToast(status.message);
        return;
      }

      // create laddergram post
      const subreddit = await context.reddit.getCurrentSubreddit();
      const post = await context.reddit.submitPost({
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
        authorUsername: userData.username,
      });

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

      context.ui.showToast({
        text: "Success: Created laddergram post!",
        appearance: "success",
      });
      context.ui.navigateTo(post);
    }
  );


  return (
    <vstack
      alignment="center middle"
      padding="large"
      width="100%"
      height="100%"
    >
      <image
        url="titleLogo.png"
        description="Title logo"
        imageWidth={titleLogoWidth}
        imageHeight={titleLogoWidth / 7.6981}
      />
      <spacer height="26px" />

      <zstack alignment="center middle" width="100%">
			{screenWidth >= 400 ? (
          <hstack>
            <image
              imageHeight={542}
              imageWidth={47}
              url="rope.png"
              height="320px"
              description="rope"
            />
            <spacer width="230px" />
            <image
              imageHeight={542}
              imageWidth={47}
              url="rope.png"
              height="320px"
              description="rope"
            />
          </hstack>
        ) : null}
        <vstack alignment="center middle" gap="large">
          <MenuButton
            label="Create Laddergram"
            screenWidth={screenWidth}
            onPress={() => {
							context.ui.showForm(newGameForm);
						}}
          />
          <MenuButton
            label="Leaderboard"
            screenWidth={screenWidth}
            onPress={() => {onNavPress("leaderboard")}}
          />
          <MenuButton
            label="How To play"
            screenWidth={screenWidth}
            onPress={() => {onNavPress("howtoplay")}}
          />
        </vstack>

        
      </zstack>
    </vstack>
  );
};
