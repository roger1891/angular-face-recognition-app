import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

const URL = "http://localhost:4000/products/upload";


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  angForm: FormGroup;

  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });
  

  image: string = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private fb: FormBuilder, private ps: ProductsService) {
    this.createForm();
   }

   ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
      };
    }

  createForm() {
    this.angForm = this.fb.group({
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      ProductPrice: ['', Validators.required]
    });
  }

  addProduct(ProductName, ProductDescription, ProductPrice){
    this.ps.addProduct(ProductName, ProductDescription, ProductPrice);
  }

  uploadImage(event) {
    const file = event.target.files[0];
    console.log("this is file: " + file);
    const path = `posts/${file.name}`;
    if (file.type.split('/')[0] !== 'image') {
      return alert('Only image files!');
    } 
    else {
      this.ps.uploadImage(file);
      //const task = this.storage.upload(path, file);
      //const ref = this.storage.ref(path);
      //this.uploadPercent = task.percentageChanges();
      //console.log('Image uploaded!');
      /*task.snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = ref.getDownloadURL();
            this.downloadURL.subscribe(url => {
              this.image = url
              console.log('URL is: ' + url);         
            });
          })
        )
        .subscribe();
      console.log('Image submitted into Firestore');*/
    }
  }    

}
