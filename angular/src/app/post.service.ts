//TODO: Incorporate user validation into each method
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Post } from './post' 
import { User } from './user'
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  currentPost: Post
  currentUser: User

  //Observable for list of posts
  posts = this.socket.fromEvent<string[]>('update')

  //Observable + subscription for updating client cookies with new user when server gives 
  userEvent = this.socket.fromEvent<string>('newUser').subscribe( val => {
    this.currentUser = (new User).deserialze(val)
    this.cookieService.set('USER', JSON.stringify(this.currentUser))
  });

  constructor(private socket: Socket, private cookieService: CookieService) { }

  //If the user cookie is set, attempt to verify it on backend
  //Backend Emit newUser if the cookie is an invalid user, which is handled by the sub
  //above
  //If no user cookie, verify against null and get a new user
  getUser(){
    if(this.cookieService.check('USER')){
      this.currentUser = (new User).deserialze(JSON.parse(this.cookieService.get('USER')))
      this.socket.emit('getUser', JSON.parse(this.cookieService.get('USER')))
    }
    else{
      this.socket.emit('getUser', "{uid: '', secret: ''}")
    }
  }

  setCurrentPost(id: string){
    //Change post
  }

  newPost(text: string){
    //emit new post based on passed text
  }

  votePost(vote: number){
    //emit new vote
  }
}
