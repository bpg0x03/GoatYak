//TODO: Incorporate user validation into each method
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Post } from './post' 
import { User } from './user'
import { mComment } from './mcomment';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  currentUser: User
  selectedPostBS = new BehaviorSubject(new Post());
  selectedPost = this.selectedPostBS.asObservable();

  //Observables for adding and updating posts
  posts = this.socket.fromEvent<Post[]>('update')
  postAdder = this.socket.fromEvent<Post>('addOne')
  postUpdater = this.socket.fromEvent<Post>('updateOne')
  //Observable + subscription for updating client cookies with new user when server gives 
  userEvent = this.socket.fromEvent<string>('newUser').subscribe( val => {
    this.currentUser = (new User).deserialze(val)
    this.cookieService.set('USER', JSON.stringify(this.currentUser))
    document.location.reload()
  });

  constructor(private socket: Socket, private cookieService: CookieService) { }

  //If the user cookie is set, attempt to verify it on backend
  //Backend Emit newUser if the cookie is an invalid user, which is handled by the sub
  //above
  //If no user cookie, verify against null and get a new user
  getUser(){
    if(this.cookieService.check('USER')){
      this.currentUser = (new User).deserialze(JSON.parse(this.cookieService.get('USER')))
      this.socket.emit('getUser', JSON.stringify(JSON.parse(this.cookieService.get('USER'))))
    }
    else{
      this.socket.emit('getUser', JSON.stringify({uid:'', secret:''}))
    }
  }

  getPosts(){
    this.socket.emit('returnFeed', {count: 50})
  }
  setCurrentPost(post: Post){
    this.selectedPostBS.next(post);
  }

  newPost(text: string){
    this.socket.emit('new-message', {user: JSON.stringify(this.currentUser), post:{uid: this.currentUser.uid, text: text} })
  }

  newComment(post: Post, text: string){
    this.socket.emit('comment', {user: JSON.stringify(this.currentUser), post: post, text: text })
  }

  voteComment(post: Post, comment: mComment, val: Number){
    this.socket.emit('voteComment', {user: JSON.stringify(this.currentUser), postid: post._id, commentid: comment._id, val: val })
  }

  votePost(post: Post, val: Number){
    this.socket.emit('vote', {user: JSON.stringify(this.currentUser), _id: post._id, val: val})
  }
}
