import { Devvit } from "@devvit/public-api";

import words_4letter from "../data/words_4letter.json";
import words_5letter from "../data/words_5letter.json";

export const dailyChallenge = Devvit.addSchedulerJob({
  name: "DAILY_CHALLENGE_JOB",
  onRun: async (event, context) => {},
});
