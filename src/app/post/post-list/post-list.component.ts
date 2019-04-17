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
  isLoading = false;

  constructor(public postService: PostService) { };

  ngOnInit() {
    this.isLoading = true;

    // calls the http request from the method
    this.postService.getPosts();

    // subscribe/listen to the Observable
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(){
    // remove the subcription and avoid memory leaks in the app.
    this.postSub.unsubscribe();
  }


}
