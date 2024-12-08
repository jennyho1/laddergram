export type PostData = {
  postId: string;
  startWord: string;
	targetWord: string;
	authorUsername: string;
	optimalSteps: number;
};



export type LaddergramPostData = {
	postId: string;
	postType: string;
  startWord: string;
	targetWord: string;
	authorUsername: string;
	optimalSteps: number;
}

export type PinnedPostData = {
	postId: string;
  postType: string;
}