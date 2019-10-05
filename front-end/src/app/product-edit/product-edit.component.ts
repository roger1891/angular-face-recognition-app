import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Observable } from 'rxjs';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  angForm: FormGroup;
  public uploader: FileUploader = new FileUploader({ url: this.ps.uploadLink(), itemAlias: 'photo' });4
  ProductLink: string = null;
  uploadPercent: Observable<number>;
  product: any = {};
  isEditImg = false;
  isNewImgUploaded = false;
  

  //preview image upon upload
  imagePath: string;
  imgURL: any;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductsService,
    private fb: FormBuilder) {
      this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ps.editProduct(params['id']).subscribe(res => {
        this.product = res;
        //set default image from database
        this.imgURL = this.product.ProductLink;
      });
     });

   
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

  editImageBtn(){
    this.isEditImg = true;
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
      //upload percentage for progressbar
      this.uploadPercent = new Observable((observer) => {
        Math.round((_event.loaded / _event.total) * 100);  
      });
      this.imgURL = reader.result; 

      //is for image upload buttons
      this.isEditImg = false;
      //is for send data button
      this.isNewImgUploaded = true
    }
  }

 
  
  createForm(){
    this.angForm = this.fb.group({
      ProductFile: ['', Validators.length > 0],
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      ProductPrice: ['', Validators.required]
    });
  }

  updateProduct(ProductName, ProductDescription, ProductPrice, id){
    this.route.params.subscribe(params => {
      //if image has been uploaded...
      if(this.isNewImgUploaded){
        //use product link based on image uploaded details
        this.ps.updateProduct(this.ProductLink, ProductName, ProductDescription, ProductPrice, params.id);
      } else {
        //use img url based on database
        this.ps.updateProduct(this.imgURL, ProductName, ProductDescription, ProductPrice, params.id);
      }
      //upload content to server
      this.uploader.uploadAll();
    });
  }
}
