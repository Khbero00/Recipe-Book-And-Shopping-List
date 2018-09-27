import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { ShoppingListComponent } from './features/shopping-list/shopping-list.component';
import { RecipeBookComponent } from './features/recipe-book/recipe-book.component';
import { RecipeDetailComponent } from './features/recipe-book/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './features/recipe-book/recipe-list/recipe-list.component';
import { RecipeItemComponent } from './features/recipe-book/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListEditComponent } from './features/shopping-list/shopping-list-edit/shopping-list-edit.component';
import { HeaderComponent } from './features/header/header.component';
import { HomeComponent } from './features/home/home.component';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'recipes', component: RecipeBookComponent, children: [
    {path: ':id', component: RecipeDetailComponent},
  ]},
  {path: 'shopping-list', component: ShoppingListComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ShoppingListComponent,
    RecipeBookComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent,
    ShoppingListEditComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NoopAnimationsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
