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
 
  constructor(private fda: FacedetAPIService, private ps: ProductsService, private modalService: BsModalService) { }

  ngOnInit() {
  }
  //webcam vars
  public showWebcam = true;
  public mirrorImage: string = "never";
  public errors: WebcamInitError[] = [];
  public seconds:number ;
  private trigger: Subject<void> = new Subject<void>();

  
  //modal
  modalRef: BsModalRef;
  //modal content
  private status: string;
  private confidenceLevel: number;
  private name: string;
  private origImage: string;
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
    //store webcam image into variable
    this.webcamImage = webcamImage;
    //send image to api
    this.fda.sendImage(this.webcamImage.imageAsDataUrl).subscribe(res => {
      //tag array:displays details of image verification
      let tagArray = res["photos"][0].tags;
      //if there is no tag array
      if (!Array.isArray(tagArray) || !tagArray.length) {
        this.status = "Error";
        //open modal
        this.openModal(this.errorModalTemplate);
        return;
      }
      //set variables
      let entryId = res["photos"][0].tags[0].uids[0].prediction; 
      this.status = res["status"];
      this.confidenceLevel = (res["photos"][0].tags[0].uids[0].confidence * 100);
      
      //check database for id
      this.ps.editProduct(entryId).subscribe(res => {
        //set variables
        this.name = res["ProductName"];
        this.origImage = res["ProductLink"];
        //open modal
        this.openModal(this.successModalTemplate);
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
