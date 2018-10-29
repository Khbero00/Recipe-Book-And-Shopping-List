import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const authRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
];

@NgModule({
    imports: [
        RouterModule.forRoot(authRoutes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AuthRoutingModule { }