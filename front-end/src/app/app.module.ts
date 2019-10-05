import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductGetComponent } from './product-get/product-get.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from './products.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileSelectDirective } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { ImageUploadService } from './image-upload.service';


@NgModule({
  declarations: [
    AppComponent,
    ProductAddComponent,
    ProductGetComponent,
    ProductEditComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    FormsModule
  ],
  providers: [
    ProductsService,
    ImageUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
