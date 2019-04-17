import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from './../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading = false;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  // determing if we are in edit mode or create mode
  ngOnInit() {
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        // Start spinner
        this.isLoading = true;

        this.postService.getPost(this.postId).subscribe(postData => {

          // Stop spinner
          this.isLoading = false;

          this.post = { id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // Methods
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    // Start spinner
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }

    // cleaning up the forms after added.
    form.resetForm();
  }
}
