import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Observable } from 'rxjs';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { ImageUploadService } from '../image-upload.service';


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
  imgURL: any;

  constructor(private fb: FormBuilder, private ps: ProductsService, private ims :ImageUploadService) {
    this.createForm();
  }

  ngOnInit() {
    //upload after adding file
    this.uploader.onAfterAddingFile = (file) => { 
      //create image path from file
      this.ProductLink = this.ims.createProductLink(file);
    };
    //upload on completion
    this.ims.uploaderOnCompletion(this.uploader);
  }

  
  previewImage(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return alert('Only image files!');
    }
    
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      //upload percentage
      this.uploadPercent = new Observable((observer) => {
        Math.round((_event.loaded / _event.total) * 100);  
      });
      
      this.imgURL = reader.result; 
    };
  }
  
  createForm() {
    this.angForm = this.fb.group({
      ProductFile: ['', Validators.required],
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
