import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


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
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'home', canActivate: [AuthGuard], component: HomeComponent},
  {path: 'recipes', canActivate: [AuthGuard], component: RecipeBookComponent, children: [
    {path: ':id', component: RecipeDetailComponent},
  ]},
  {path: 'shopping-list', canActivate: [AuthGuard], component: ShoppingListComponent}
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
    LoginComponent,
    SignUpComponent,
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
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    NoopAnimationsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
