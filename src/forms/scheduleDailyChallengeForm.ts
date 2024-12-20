import { Devvit } from "@devvit/public-api";
import { addDailyChallengeWords } from "../utils/addDailyChallengeWords.js";


export const scheduleDailyChallengeForm = Devvit.createForm(
  {
    fields: [
      {
        type: "number",
        name: "hour",
        label:
          "At what hour (0-23) UTC would you like the daily challenge to be posted?",
        required: true,
      },
    ],
  },
  async (event, context) => {
		// await addDailyChallengeWords(context)
		// const record = await context.redis.hGetAll('dailyChallenges');
		// console.log(record)

    const hour = event.values.hour;
    if (hour < 0 || hour > 23) {
      context.ui.showToast("Error: Hour input must be between 0-23.");
      return;
    }

		// check if a daily challenge job is already running
		const subreddit = await context.reddit.getCurrentSubreddit();
		const key = `dailyChallengeJobId:${subreddit}`;
		const jobId = await context.redis.get(key);
    if (jobId) {
      context.ui.showToast("Daily challenges are already running.");
      return;
    }

		// schedule job 
		const newJobId = await context.scheduler.runJob({
      name: 'DAILY_CHALLENGE_JOB',
      cron: `0 ${hour} * * *`,
    });

		// save job to redis
		await context.redis.set(key, newJobId);
		context.ui.showToast("Daily challenges are successfully running.")
	}
);
