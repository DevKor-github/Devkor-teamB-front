import UserInfo from '../../UserTypes.tsx';

export interface Comment {
  commentId: number;
  userId: string;
  content: string;
}
export interface Post {
  postId: number;
  author: UserInfo;
  title: string;
  postDate: string;
  view: number;
  content: string;
  comments: Comment[];
}

export type Community = Map<string, Post[]>;
