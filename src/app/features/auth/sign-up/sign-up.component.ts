import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  addUserForm: FormGroup;

  constructor(private authService: AuthService, private afs: AngularFirestore, private router: Router) { }

  ngOnInit() {

    this.addUserForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required]),
      // 'confirmPassword': new FormControl(null, [Validators.required, this.passwordConfirming.bind(this)])
    });
  }

  // passwordConfirming(c: AbstractControl): { invalid: boolean } {
  //   if (c.get('password').value !== c.get('confirm_password').value) {
  //       return {invalid: true};
  //   }
// }

get email() { return this.addUserForm.get('email') }
get password() { return this.addUserForm.get('password') }

signUp() {
  this.authService.emailSignUp(this.email.value, this.password.value).subscribe(fbAuth => {
    this.afs.collection("users").doc(fbAuth.user.uid).set({
      email: fbAuth.user.email
    });
    
    this.router.navigate(['/login']);
  }, error => {
    console.log(error);
  });
}

}
