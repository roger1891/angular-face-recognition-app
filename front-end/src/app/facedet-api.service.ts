import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FacedetAPIService {
  uri = "http://localhost:4000";
  constructor(
    private http: HttpClient,
    private router: Router) { }


  sendImage(imgUrl){
    console.log(imgUrl);
    const obj = {
      url: imgUrl
    };    
    
    this.http.post(`${this.uri}`, obj)
      .subscribe(res => {
        console.log("this is res: " + JSON.stringify(res));
        console.log('image sent to api done');
      });
  }

}
