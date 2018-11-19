import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { HeaderModule } from '../header/header.module';

import { CommonModule } from '@angular/common';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeBookComponent } from './recipe-book.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeBookRoutingModule } from './recipe-book-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    RecipeBookComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent
  ],
  imports: [
      CommonModule,
      RouterModule,
      HeaderModule,
      ReactiveFormsModule,
      SharedModule,
      FlexLayoutModule,
      RecipeBookRoutingModule
  ],
})
export class RecipeBookModule { }