import { NgModule } from '@angular/core';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { FirebaseModule } from './firebase/firebase.module';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
      AlertDialogComponent
  ],
  imports: [
    CommonModule,
    FirebaseModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],

  exports: [FirebaseModule, MaterialModule],

  entryComponents: [AlertDialogComponent],
})
export class SharedModule { }