// TODO: Incorporate user validation into each method
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IUser } from '../../../models/User';
import { IPost } from '../../../models/Post';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  currentUser: IUser;
  selectedPost: IPost;

  // Observables for adding and updating posts
  posts = this.socket.fromEvent<IPost[]>('update');
  postAdder = this.socket.fromEvent<IPost>('addOne');
  postUpdater = this.socket.fromEvent<IPost>('updateOne');
  // Observable + subscription for updating client cookies with new user when server gives
  userEvent = this.socket.fromEvent<IUser>('newUser').subscribe(val => {
    this.currentUser = val;
    this.cookieService.set('USER', JSON.stringify(this.currentUser));
    document.location.reload();
  });

  constructor(private socket: Socket, private cookieService: CookieService) { }

  // If the user cookie is set, attempt to verify it on backend
  // Backend Emit newUser if the cookie is an invalid user, which is handled by the sub
  // above
  // If no user cookie, verify against null and get a new user
  getUser() {
    if (this.cookieService.check('USER')) {
      this.currentUser = JSON.parse(this.cookieService.get('USER')) as IUser;
      this.socket.emit('getUser', this.currentUser);
    } else {
      this.socket.emit('getUser', {});
    }
  }

  getPosts() {
    this.socket.emit('returnFeed', { count: 50 });
  }
  setCurrentPost(post: IPost) {
    this.selectedPost = post;
  }

  newPost(text: string) {
    this.socket.emit('new-message', { user: this.currentUser, post: { uid: this.currentUser.uid, text } });
  }

  votePost(post: IPost, val: number) {
    this.socket.emit('vote', { user: this.currentUser, _id: post._id, val });
  }
}
