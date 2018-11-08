import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [
      LoginComponent,
      SignUpComponent,
  ],
  imports: [
      CommonModule,
      RouterModule,
      ReactiveFormsModule,
      SharedModule,
      FlexLayoutModule,
      AuthRoutingModule
  ],
  entryComponents: [AlertDialogComponent],
})
export class AuthModule { }