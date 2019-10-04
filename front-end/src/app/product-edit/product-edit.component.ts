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
  
  


  createForm(){
    this.angForm = this.fb.group({
      ProductFile: ['', Validators.required],
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      ProductPrice: ['', Validators.required]
    });
  }

  updateProduct(ProductName, ProductDescription, ProductPrice, id){
    this.route.params.subscribe(params => {
      this.ps.updateProduct(this.ProductLink, ProductName, ProductDescription, ProductPrice, params.id);
      //upload content to server
      this.uploader.uploadAll();
    });
  }
}
