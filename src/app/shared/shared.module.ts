import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FirebaseModule } from './firebase/firebase.module';
import { MaterialModule } from './material/material.module';

import { RecipeDialogComponent } from './components/recipe-dialog/recipe-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ShoppingListDialogComponent } from './components/shopping-list-dialog/shopping-list-dialog.component';
import { DeletionDialogComponent } from './components/deletion-dialog/deletion-dialog.component';



RecipeDialogComponent

@NgModule({
  declarations: [
    RecipeDialogComponent,
    AlertDialogComponent,
    ShoppingListDialogComponent,
    DeletionDialogComponent,
  ],
  imports: [
    CommonModule,
    FirebaseModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],

  exports: [FirebaseModule, MaterialModule],

  entryComponents: [RecipeDialogComponent, DeletionDialogComponent, AlertDialogComponent, ShoppingListDialogComponent],
})
export class SharedModule { }