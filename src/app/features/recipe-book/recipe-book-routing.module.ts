import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth-guard.service';
import { RecipeBookComponent } from './recipe-book.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

const recipeRoutes: Routes = [
    {path: 'recipes', canActivate: [AuthGuard], component: RecipeBookComponent},
    {path: 'recipes/:id',canActivate: [AuthGuard], component: RecipeDetailComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(recipeRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class RecipeBookRoutingModule { }