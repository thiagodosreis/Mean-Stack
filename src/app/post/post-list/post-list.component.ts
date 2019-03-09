import { Component, Input, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit{
  // posts = [
  //   { title: 'First post', content: 'this is the first post content'},
  //   { title: 'Second post', content: 'this is the second post content'},
  //   { title: 'Third post', content: 'this is the thirs post content'}
  // ];

  @Input() posts: Post[] = [];

  // constructor(public postService: PostService){};

  ngOnInit(){
    // this.posts = this.postService.getPosts();
  }
}
