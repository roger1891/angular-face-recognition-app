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
}
