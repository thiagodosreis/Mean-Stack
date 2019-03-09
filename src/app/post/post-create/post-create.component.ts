import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from './../post.model';
// import { PostService } from '../post.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  // event definition
  @Output() postCreated = new EventEmitter<Post>();

  // Using Service we dont need the EventEmitter anymore
  // constructor(public postService: PostService){}

  // Methods
  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }

    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    // emitting the event with the data
    this.postCreated.emit(post);

    // Using Service we dont need the EventEmitter anymore
    // this.postService.addPost(form.value.title, form.value.content);
  }


}
