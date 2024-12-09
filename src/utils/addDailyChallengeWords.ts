import { Context } from "@devvit/public-api";

import dailyWords from "../data/daily_2024.json";

export async function addDailyChallengeWords(context: Context) {
  Object.entries(dailyWords).forEach(async ([key, value]) => {
    await context.redis.hSet("dailyChallenges", {
      [key]: value,
    });
  });
}
