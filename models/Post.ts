import { model, Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IVoteAction {
   uid: IUser["uid"];
   val: number;
}

export interface IComment {
   uid: IUser["uid"];
   text: string;
   votes: number;
   votedOn: IVoteAction[];
}

export interface IPost extends Document {
   uid: IUser["uid"];
   createdAt: Date;
   text: string;
   votes: number;
   comments: IComment[];
}

const CommentSchema = new Schema<IComment>({
   uid: String,
   text: String,
   votes: Number
});

const PostSchema = new Schema<IPost>({
   uid: String,
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   text: String,
   votes: Number,
   comments: CommentSchema
});

//Set the index argument for posts to delete after 1 hour
PostSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 3600 });

const Post = model<IPost>('Post', PostSchema);
export default Post;