import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../user'
import { PostService } from 'src/app/post.service'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Observable<string[]>
  currentPost: string;
  user: User;
  private _postSub: Subscription
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.posts = this.postService.posts
    this.postService.getUser()
    //this._postSub = this.postService.currentPost.subscribe(post => this.currentPost = post.id)
    this.user = this.postService.currentUser
  }
  ngOnDestroy() {

  }

}
