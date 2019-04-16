import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root' })
export class PostService{
  private posts: Post[] = [];
  // Observable Event
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  // Pipe allows us to add in an operator. its changes data before the data is returned.
  // Map transforms every element from an array in a new element and store back in an array.
  getPosts() {
   this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map( post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  // Exports the "Event Listener"
  // Allow methods to subscribe to this event
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};

    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData);

        // updating the id of the Post.
        const id = responseData.postId;
        post.id = id;

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // Emitting a copy of Posts to the event "postsUpdated"
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {

        // removing the deleted id from the posts objs
        // filter allows us to only return a subset of the array that is returned true.
        const updatedPosts = this.posts.filter(post => {
            return post.id !== postId;
        });

        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); // now all the app knows about it.
      });
  }
}
