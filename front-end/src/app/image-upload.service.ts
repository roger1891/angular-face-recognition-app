import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private ps: ProductsService) { }
  productLink : any;

  createProductLink(file){
    //initialize local variables
    let myDate: number = Date.now();
    let url = "http://localhost:4000/uploads"
    file.withCredentials = false;
    let filename: string;
    
    //rename the file
    file.file.name = myDate + '-' + file.file.name;
    filename = file.file.name;

    //image path
    return url + '/' + filename;  
  }

  uploaderOnCompletion(uploader){
    uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      //this.uploader.queue[0].remove();
      alert('File uploaded successfully');
    };
  }
}
