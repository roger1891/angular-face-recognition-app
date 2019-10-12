import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import { FacedetAPIService } from '../facedet-api.service';
import { ProductsService } from '../products.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //get #modal_Template  reference
  @ViewChild('success_Modal_Template', {static: false}) successModalTemplate: TemplateRef<void>;
  @ViewChild('error_Modal_Template', {static: false}) errorModalTemplate: TemplateRef<void>;
  error_Modal_Template
  constructor(private fda: FacedetAPIService, private ps: ProductsService, private modalService: BsModalService) { }

  ngOnInit() {
  }
  public showWebcam = true;
  public mirrorImage: string = "never";
  public errors: WebcamInitError[] = [];
  public seconds:number ;
  private trigger: Subject<void> = new Subject<void>();


  //modal
  modalRef: BsModalRef;
  //modal content
  private status: string
  private confidenceLevel: number
  private name: string
  // latest snapshot
  public webcamImage: WebcamImage = null;
  

  //modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ backdrop: 'static', keyboard: false });
  }


  //image
  public triggerSnapshot(): void {
    this.seconds = 3;
    setTimeout(()=>{
      this.seconds = 2;
      setTimeout(()=>{
        this.seconds = 1
        setTimeout(()=>{
          this.trigger.next(); 
          this.seconds = null;
        },2000)
      },2000) 
    },2000)     
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info("received webcam image", webcamImage);
    this.webcamImage = webcamImage;
    console.log("this is: " + this.webcamImage.imageAsDataUrl);
    //this.fda.sendImage(this.webcamImage.imageAsDataUrl);
    //send image to api
    this.fda.sendImage("http://localhost:4000/uploads/1570363432578-coder.jpg").subscribe(res => {
      console.log("this is res: " + JSON.stringify(res));
      //tag array:displays details of image verification
      let tagArray = res["photos"][0].tags;
      if (!Array.isArray(tagArray) || !tagArray.length) {
        // array does not exist, is not an array, or is empty
        // ⇒ do not attempt to process array
        console.log("error");
        this.status = "Error";
        //open modal
        this.openModal(this.errorModalTemplate);
        return;
      }
      
      //this.fda.sendImage(this.webcamImage.imageAsDataUrl).subscribe(res => {
      //set variables
      let entryId = res["photos"][0].tags[0].uids[0].prediction; 
      this.status = res["status"];
      this.confidenceLevel = (res["photos"][0].tags[0].uids[0].confidence * 100);
      //console.log("this is res: " + JSON.stringify(res));
      //console.log('image sent to api done');
      //console.log("this is id: " + entryId);
      

      //check database for id
      this.ps.editProduct(entryId).subscribe(res => {
        //set variables
        this.name = res["ProductName"];
        //open modal
        this.openModal(this.successModalTemplate);
        //alert(status + ", Name: " + name + " We are about " + confidenceLevel + "sure" );
        //set product array to respond from url
        //this.product = res;
        //set default image from database
        //this.imgURL = this.product.ProductLink;
      })

    });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  //turn camera on or off
  public startWebcam() {
    return this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
}
