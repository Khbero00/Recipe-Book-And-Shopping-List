import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  
  screenWidth: number;
  screenHeight: number;

  loginStyles: any;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '350px',
      data: {message: "Your email or password was invalid."}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onLogin() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      userAuth => {
        this.authService.getUser(userAuth.user);
        this.router.navigate(['/home']);
      },
      error =>  {
        if (error && error.code) {
          this.openDialog();
        }
      });
  }
}
