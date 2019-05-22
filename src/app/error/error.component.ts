import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent {

  // this is an way Angular Material Pass data on to the Dialog Component
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}
}
