import { SortedSetData } from "./SortedSetData.js";

export type PostResults = {
  scores: SortedSetData[];
  playerCount: number;
	solvedCount: number;
};