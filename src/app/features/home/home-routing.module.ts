import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth-guard.service';
import { HomeComponent } from './home.component';

const homeRoutes: Routes = [
  {path: 'home', canActivate: [AuthGuard], component: HomeComponent},

];

@NgModule({
    imports: [
        RouterModule.forRoot(homeRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class HomeRoutingModule { }