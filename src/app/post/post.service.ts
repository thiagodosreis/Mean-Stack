import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root' })
export class PostService{
  private posts: Post[] = [];

  //Observable Event
  private postsUpdated = new Subject<Post[]>();

  getPosts(){
    //returning a new array with the copied content
    //to avoid returning the original array object as reference only
    //and let it be manipulated outside this class
    return [...this.posts];
  }

  //Exports the "Event Listener"
  //Allow methods to subscribe to this event
  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string){
    const post: Post = {title: title, content: content};
    this.posts.push(post);

    //Emitting a copy of Posts to the event "postsUpdated"
    this.postsUpdated.next([...this.posts]);
  }
}
