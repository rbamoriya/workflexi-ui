import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet/wallet.component';
import { MatButtonModule, MatInputModule, MatToolbarModule, MatIconModule, MatCardModule, MatChipsModule, MatListModule, MatTabsModule, MatProgressBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatStepperModule, MatExpansionModule, MatMenuModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { ShareModule } from '../share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';


@NgModule({
  declarations: [WalletComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    ShareModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe]
})
export class WalletModule { }
