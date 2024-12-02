export type PostData = {
  postId: string;
  startWord: string;
	targetWord: string;
	authorUsername: string;
};



export type LaddergramPostData = {
	postId: string;
	postType: string;
  startWord: string;
	targetWord: string;
	authorUsername: string;
}

export type PinnedPostData = {
	postId: string;
  postType: string;
}