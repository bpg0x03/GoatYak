import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../user'
import { Post } from '../post'
import { PostService } from 'src/app/post.service'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  //UI Bound array for holding post objects
  posts: Post[]
  //The user
  user: User;
  //Subscription for updating already existant posts
  private _postSub: Subscription
  //Subscription for adding posts without another DB query
  private _postAdder: Subscription

  constructor(private postService: PostService) { }

  ngOnInit() {
    //Get all posts from the observable
    this.postService.posts.subscribe(posts => ( this.posts = posts))
    //Initialize/verify user
    this.postService.getUser()
    //Subscription for pushing new post to front of array
    this._postAdder = this.postService.postAdder.subscribe(newOne => this.posts.unshift(newOne))
    //Subscription for upding posts that are already in array (Untested)
    this._postSub = this.postService.postUpdater.subscribe(newOne => this.posts[this.posts.findIndex( post => post._id === newOne._id )] = newOne)
    //Copy service user to component for use in UI stuff (user listing on top of page)
    this.user = this.postService.currentUser
    //Request initial posts
    this.postService.getPosts()
  }
  ngOnDestroy() {

  }
  newPost(text: string){
    this.postService.newPost(text)
  }
}
