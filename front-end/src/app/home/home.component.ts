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
  @ViewChild('modal_Template', {static: false}) modalTemp: TemplateRef<void>;
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
    //console.log("this is: " + this.webcamImage.imageAsDataUrl);
    //this.fda.sendImage(this.webcamImage.imageAsDataUrl);
    //send image to api
    this.fda.sendImage("http://localhost:4000/uploads/1570563000257-arnold4.jpg").subscribe(res => {
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
        this.openModal(this.modalTemp);
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
