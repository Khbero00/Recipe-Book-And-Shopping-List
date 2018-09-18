import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ShoppingListComponent } from './features/shopping-list/shopping-list.component';
import { RecipeBookComponent } from './features/recipe-book/recipe-book.component';
import { RecipeDetailComponent } from './features/recipe-book/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './features/recipe-book/recipe-list/recipe-list.component';
import { RecipeItemComponent } from './features/recipe-book/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListEditComponent } from './features/shopping-list/shopping-list-edit/shopping-list-edit.component';
import { HeaderComponent } from './features/header/header.component';
import { HomeComponent } from './features/home/home.component';

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
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
