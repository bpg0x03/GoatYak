import { model, Schema, Document } from 'mongoose';
import { getUID } from '../controllers/UID';
import { IPost } from './Post';
import rand from 'crypto-random-string';

export interface IUser extends Document {
   uid: string;
   secret: string;
   
   //votingHistory: IVoteAction[];
}

// export interface IVoteAction {
//    postId: IPost["_id"];
//    val: number;
// }

const UserSchema = new Schema<IUser>({
   uid: { type: String, default: () => getUID()},
   secret: { type: String, default: () => rand({ length: 32 })},
   lastUpdated: { type: Date, default: Date.now }
});

//Set the index argument for posts to delete after 2 days
UserSchema.index({ "lastUpdated": 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2 });
UserSchema.index({ uid : 1, secret: 1 });
UserSchema.index({ "votingHistory.postId" : 1 });

const User = model<IUser>('User', UserSchema);
export default User;
