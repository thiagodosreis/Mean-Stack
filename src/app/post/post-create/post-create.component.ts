import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from './../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

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
  imagePreview: string;

  // reactive forms
  form: FormGroup;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  // determing if we are in edit mode or create mode
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        // Start spinner
        this.isLoading = true;

        this.postService.getPost(this.postId).subscribe(postData => {

          // Stop spinner
          this.isLoading = false;

          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };

          // setting values to the reactive form
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    // type conversion
    const file = (event.target as HTMLInputElement).files[0];
    // patchValue allows to target a single control
    this.form.patchValue({image: file}); // storing the file Object / Not the text, but the Image
    this.form.get('image').updateValueAndValidity(); // I changed the value so update the form

    // displaying a preview
    // Convert to Data URL first
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file); // this will start the onload method
  }

  // Methods
  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    // Start spinner
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }

    // cleaning up the forms after added.
    this.form.reset();
  }
}
