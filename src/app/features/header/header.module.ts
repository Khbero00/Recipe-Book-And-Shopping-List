import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
      HeaderComponent
  ],
  imports: [
      RouterModule,
      SharedModule
  ],

  exports: [
      HeaderComponent
  ]
})
export class HeaderModule { }