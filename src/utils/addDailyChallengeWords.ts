import { Context } from "@devvit/public-api";

import dailyWords from "../data/daily/daily_2025.json" assert { type: "json" };;
import { validateLaddergram } from "./validateLaddergram.js";

export async function addDailyChallengeWords(context: Context) {
  Object.entries(dailyWords).forEach(async ([key, value]) => {
		if (value=="") return;
		// validate word
		const [startWord, targetWord] = value.split(",")
		const status = validateLaddergram(startWord, targetWord);
		if (!status.success){
			console.log(`ERROR: ${key} with words ${startWord} and ${targetWord}`)
			console.log(status.message)
		}
    await context.redis.hSet("dailyChallenges", {
      [key]: value,
    });
  });
}
