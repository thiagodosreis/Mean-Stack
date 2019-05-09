import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root' })
export class PostService{
  private posts: Post[] = [];
  // Observable Event
  private postsUpdated = new Subject< { posts: Post[], postCount: number } >();

  constructor(private http: HttpClient, private router: Router) {}

  // Pipe allows us to add in an operator. its changes data before the data is returned.
  // Map transforms every element from an array in a new element and store back in an array.
  getPosts(postsPerPage: number, currentPage: number) {
   const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
   this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map( post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }),
      maxPosts: postData.maxPosts
      };
    }))
    .subscribe((transformedPostsData) => {
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts } );
    });
  }

  // Exports the "Event Listener"
  // Allow methods to subscribe to this event
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // find function will return a new array from the original one with the values that match / return true.
    // "..." means: return an actual new object and not a reference to the original object (bc copy of objs in JS is just a reference).
    // return {...this.posts.find(p => p.id === id)};

    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {id: null, title, content}; //replacing JSON by FormData to send Images too
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof(image) === 'object') { // File object to upload
       postData = new FormData();
       postData.append('id', id);
       postData.append('title', title);
       postData.append('content', content);
       postData.append('image', image, title);

    } else { // string with the url of the image
      postData = { id, title, content, imagePath: image, creator: null };
    }

    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe( response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
