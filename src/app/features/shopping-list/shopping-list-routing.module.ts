import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth-guard.service';
import { ShoppingListComponent } from './shopping-list.component';

const shoppingListRoutes: Routes = [
    {path: 'shopping-list', canActivate: [AuthGuard], component: ShoppingListComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(shoppingListRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class ShoppingListRoutingModule { }