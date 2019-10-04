import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Observable } from 'rxjs';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  angForm: FormGroup;
  public uploader: FileUploader = new FileUploader({ url: this.ps.uploadLink(), itemAlias: 'photo' });

  ProductLink: string = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  //preview image upon upload
  imagePath: string;
  imgURL: any;

  constructor(private fb: FormBuilder, private ps: ProductsService) {
    this.createForm();
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { 
      //initialize local variables
      let myDate: number = Date.now();
      let url = "http://localhost:4000/uploads"
      file.withCredentials = false;
      let filename: string;
      
      //rename the file
      file.file.name = myDate + '-' + file.file.name;
      filename = file.file.name;

      //image path
      this.ProductLink = url + '/' + filename;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      //this.uploader.queue[0].remove();
      alert('File uploaded successfully');
    };
  }

  
  previewImage(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return alert('Only image files!');
    }
    
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      //upload percentage
      this.uploadPercent = new Observable((observer) => {
        Math.round((_event.loaded / _event.total) * 100);  
      });
      
      this.imgURL = reader.result; 
    }
  }
  
  createForm() {
    this.angForm = this.fb.group({
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      ProductPrice: ['', Validators.required]
    });
  }

  addProduct(ProductName, ProductDescription, ProductPrice){
    //upload values to database
    this.ps.addProduct(this.ProductLink, ProductName, ProductDescription, ProductPrice);
    //upload content to server
    this.uploader.uploadAll();
  }
  /*
  imageLoader(event){
    console.log(this.uploader.progress);
    //this.uploadPercent = this.uploader.progress;
  }*/
  uploadImage(event) {
    const file = event.target.files[0];
    console.log("this is file: " + file);
    const path = `posts/${file.name}`;
    if (file.type.split('/')[0] !== 'image') {
      return alert('Only image files!');
    } 
    else {
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
