import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

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
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    // calls the http request from the method
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    // subscribe/listen to the Observable
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe( ( postData: { posts: Post[], postCount: number } ) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    // let me know if the user is authenticated or not.
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
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
    }, (error) => { // handling errors
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    // remove the subcription and avoid memory leaks in the app.
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }


}
