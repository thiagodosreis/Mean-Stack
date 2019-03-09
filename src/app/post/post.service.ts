import { Post } from './post.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root' })
export class PostService{
  private posts: Post[] = [];

  getPosts(){
    //returning a new array with the copied content
    //to avoid returning the original array object as reference only
    return [...this.posts];
  }

  addPost(title: string, content: string){
    const post: Post = {title: title, content: content};
    this.posts.push(post);
  }
}
