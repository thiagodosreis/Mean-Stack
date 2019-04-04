import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postSub: Subscription;

  constructor(public postService: PostService){};

  ngOnInit(){
    // calls the http request from the method
    this.postService.getPosts();

    // subscribe/listen to the Observable
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[])=>{
        this.posts = posts;
      });
  }

  ngOnDestroy(){
    // remove the subcription and avoid memory leaks in the app.
    this.postSub.unsubscribe();
  }
}
