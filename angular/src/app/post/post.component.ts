import { Component, OnInit, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { PostService } from '../post.service';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../post';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  thePost: Post
  user: User;
  posts: Post[];


  constructor(private postService: PostService, private af: ApplicationRef) { }

  ngOnInit() {
    this.postService.selectedPost.subscribe(newpost => this.thePost = newpost)
    //Get all posts from the observable
    this.postService.posts.subscribe(posts => ( this.posts = posts))
    //Initialize/verify user
    this.postService.getUser()
    //Subscription for pushing new post to front of array
    this.postService.postAdder.subscribe(newOne => this.posts.unshift(newOne))
    //Subscription for upding posts that are already in array (Untested!!) Also need it to sum the array of votes
    this.postService.postUpdater.subscribe(newOne => this.posts[this.posts.findIndex( post => post._id === newOne._id )] = newOne)
    //Copy service user to component for use in UI stuff (user listing on top of page)
    this.user = this.postService.currentUser
    //Request initial posts
    setTimeout(() => this.waitPosts(), 250)
  }

  votePost(post:Post, val: number){
    this.postService.votePost(post, val)
    this.af.tick()
  }

  sumVotes(post: Post){
    return post.votes.reduce( function (previous, current) {
      return previous+ +current.val;
    }, 0);
  }
  votedBool(post: Post, val: number){
    if(post.votes.filter(this.passUser(this.user, val)).length > 0){
      return true;
    }
    else return false;
  }
  passUser(user: User, val: number){
    return function(item){
      return (item.uid === user.uid) && (item.val == val)
    }
  }
  newComment(text: string){
    this.postService.newComment(this.thePost, text)
  }
  waitPosts(){
    this.postService.getPosts()
  }
}
