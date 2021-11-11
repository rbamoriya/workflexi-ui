
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from "@tinymce/tinymce-angular";
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LogoutComponent } from './logout/logout.component';
import { EmailValidateComponent } from './email-validate/email-validate.component';
import { UserService } from './services/user.service';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TncComponent } from './tnc/tnc.component';
import { PressRoomComponent } from './press-room/press-room.component';
import { AboutComponent } from './about/about.component';
import { WhyUsComponent } from './why-us/why-us.component';
import { AgmCoreModule } from '@agm/core';
import { LightboxModule } from 'ngx-lightbox';
import { ShareModule } from './share/share.module';

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    EmailValidateComponent,
    PrivacyPolicyComponent,
    TncComponent,
    PressRoomComponent,
    AboutComponent,
    WhyUsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    MatIconModule,
    MatExpansionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBxlLuyOoU20MYX1gCGmJUR0pVE1ajZ3po',
      libraries: ['places']
    }),
    LightboxModule,
    ShareModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, UserService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
