import { MatToolbarModule } from '@angular/material/toolbar';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ShareModule } from '../share/share.module';
import { MatSidenavModule, MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { VideoDailogComponent } from './video-dailog/video-dailog.component';


@NgModule({
  declarations: [LayoutComponent, HomeComponent, VideoDailogComponent],
  imports: [
    CommonModule,
    MainLayoutRoutingModule,
    ShareModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    CarouselModule
  ],
  entryComponents:[
    VideoDailogComponent
  ]
})
export class MainLayoutModule { }
