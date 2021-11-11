import { ShareModule } from './../share/share.module';
import { MatCardModule, MatProgressBarModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatStepperModule, MatButtonModule, MatIconModule, MatChipsModule, MatMenuModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MilestoneRoutingModule } from './milestone-routing.module';
import { CreateMilestoneComponent } from './create-milestone/create-milestone.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MilestoneApprovalViewComponent } from './milestone-approval-view/milestone-approval-view.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AprrovedMilestonesComponent } from './aprroved-milestones/aprroved-milestones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEditMilestoneComponent } from '../popup/add-edit-milestone/add-edit-milestone.component';
import { MomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [CreateMilestoneComponent, MilestoneApprovalViewComponent, AprrovedMilestonesComponent, AddEditMilestoneComponent],
  imports: [
    CommonModule,
    MilestoneRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    ShareModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatStepperModule,
    MatButtonModule,
    EditorModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    FormsModule,
    MatExpansionModule,
    ReactiveFormsModule,
    NgbModule,
    MomentDateModule
  ],
  entryComponents: [AddEditMilestoneComponent]
})
export class MilestoneModule { }
