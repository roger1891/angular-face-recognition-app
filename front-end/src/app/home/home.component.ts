import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import { FacedetAPIService } from '../facedet-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private fda: FacedetAPIService) { }

  ngOnInit() {
  }
  public showWebcam = true;
  public mirrorImage: string = "never";
  public errors: WebcamInitError[] = [];
  public seconds:number ;
  private trigger: Subject<void> = new Subject<void>();

  // latest snapshot
  public webcamImage: WebcamImage = null;
  
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
    this.fda.sendImage("http://localhost:4000/uploads/1570563000257-arnold4.jpg");
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
