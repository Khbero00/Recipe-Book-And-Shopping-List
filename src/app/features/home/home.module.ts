import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HeaderModule } from '../header/header.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
      CommonModule,
      RouterModule,
      HeaderModule,
      NgbModule.forRoot(),
      HomeRoutingModule
  ],
})
export class HomeModule { }