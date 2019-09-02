import { Socket } from 'socket.io';
import User, { IUser } from "../models/User";

//check msg.UID and msg.nonce against db, if not existant, generate new one
export async function verifyUser(msg: IUser, socket: Socket): Promise<IUser> {
    const user = await createUserIfNotExists(msg);
    socket.emit('newUser', user);        
    return user;
}

export async function createUserIfNotExists(msg: IUser) : Promise<IUser> {
    const query = { uid: msg.uid, secret: msg.secret };
    const update = { lastUpdated: Date.now() };
    const options = {
        // Return the document after updates are applied
        new: true,
        // Create a document if one isn't found.
        upsert: true,
        setDefaultsOnInsert: true
    };

    return await User.findOneAndUpdate(query, update, options).exec() as IUser;
}