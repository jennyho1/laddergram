export type UserData = {
	username: string;
	postCreated: number;
	lastPostCreatedDate: string;
};

export type UserPostData = {
	username: string;
	solved: boolean;
  score: number;
	result: string;
};