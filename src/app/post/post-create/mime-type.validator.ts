import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// getting the value of the control File
// read that and checking the type of the file

// its a function
// returns an error. If null = success
export const mimeType = (control: AbstractControl
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {


  if (typeof(control.value) === 'string') {
    return of(null); // of: creating an observable that emit data immediatelly
  }

  const file = control.value as File;
  const fileReader = new FileReader();

  const frObs = Observable.create( (observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }

      if (isValid) {
        observer.next(null); // Success Response! Valid file.
      } else {
        observer.next( { invalidMimeType: true }); // error
      }

      observer.complete();
    });
    fileReader.readAsArrayBuffer(file); // kick off the eventlistener
  });

  return frObs;
};
