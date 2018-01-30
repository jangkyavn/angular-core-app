import { Injectable } from '@angular/core';

import { DataService } from '../services/data.service';

@Injectable()
export class UploadService {
  responseData: any;

  constructor(private dataService: DataService) { }

  postWithFile(url: string, postData: any, files: File[]) {
    let formData: FormData = new FormData();
    
    if (files.length > 0) {
      formData.append(files[0].name, files[0]);
    }

    if (postData !== "" && postData !== undefined && postData !== null) {
      for (var property in postData) {
        if (postData.hasOwnProperty(property)) {
          formData.append(property, postData[property]);
        }
      }
    }
    
    var returnReponse = new Promise((resolve, reject) => {
      this.dataService.postFile(url, formData).subscribe(res => {
        this.responseData = res;
        resolve(this.responseData);
      }, error => console.log(error));
    });

    return returnReponse;
  }
}
