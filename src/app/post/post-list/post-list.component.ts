import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;

    // calls the http request from the method
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    // subscribe/listen to the Observable
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe( ( postData: { posts: Post[], postCount: number } ) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;

    // pageindex starts at 0
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    // calls the http request from the method
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(){
    // remove the subcription and avoid memory leaks in the app.
    this.postSub.unsubscribe();
  }


}
