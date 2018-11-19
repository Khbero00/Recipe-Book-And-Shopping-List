import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { AuthService } from '@myapp-services/auth.service';
import { AlertDialogComponent } from '@myapp-shared-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  addUserForm: FormGroup;
  screenWidth: number;
  screenHeight: number;
  step = 0;
  hide = true;

  constructor(private authService: AuthService, private afs: AngularFirestore, private router: Router,public dialog: MatDialog) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.addUserForm = new FormGroup({
      'firstName': new FormControl(null, [Validators.required, this.noWhitespaceValidator.bind(this)]),
      'lastName': new FormControl(null, [Validators.required,this.noWhitespaceValidator.bind(this)]),
      'username': new FormControl(null, [Validators.required, this.noWhitespaceValidator.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15), this.noWhitespaceValidator.bind(this)]),
      'confirmPassword': new FormControl(null, [Validators.required, this.validateAreEqual.bind(this),this.noWhitespaceValidator.bind(this)])
    });
  }

// Get Sign Up Form Values
get firstName() { return this.addUserForm.get('firstName') }
get lastName() { return this.addUserForm.get('lastName') }
get username() { return this.addUserForm.get('username') }
get email() { return this.addUserForm.get('email') }
get password() { return this.addUserForm.get('password') }

signUp() {
  this.authService.emailSignUp(this.email.value, this.password.value).subscribe(fbAuth => {
    this.afs.collection("users").doc(fbAuth.user.uid).set({
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      username: this.username.value,
      email: fbAuth.user.email
    });
    this.router.navigate(['/login']);
    
  }, error => {
    switch(error.code) {
      case "auth/invalid-email":
        this.openDialog("Invalid email or password.");
        break;
      case "auth/weak-password":
        this.openDialog("Password must be 6 - 15 characters long.");
        break;
      case "auth/email-already-in-use":
        this.openDialog("Email is not unique please try a different one");
        break;
      default:
        this.openDialog("We're sorry something went wrong. Please try again later.");
    }
  });
}

// Angular material
setStep(index: number) {
  this.step = index;
}

nextStep() {
  this.step++;
}

prevStep() {
  this.step--;
}

openDialog(errorMessage: string): void {
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    width: '350px',
    data: {message: errorMessage}
  });

  dialogRef.afterClosed().subscribe(() => {
    console.log('The dialog was closed');
  });
}

// Custom Validators
private validateAreEqual(fieldControl: FormControl) {
  if (this.addUserForm) {
    return fieldControl.value === this.addUserForm.get("password").value ? null : {
      NotEqual: true
    };
  }
}

private noWhitespaceValidator(control: FormControl) {
  let isWhitespace = (control.value || '').trim().length === 0;
  let isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true }
}

}
