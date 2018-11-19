
import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable ,  from } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<any>;
  public isLoggedIn: boolean = false;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { 
    this.user = afAuth.authState;
  }
  
  getUser(userAuth) {
    localStorage.setItem('userId', userAuth.uid);
    return this.afs.doc(`users/${userAuth.uid}`).valueChanges();
  }

  emailSignUp(email: string, password: string) {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  login(email: string, password: string): Observable<auth.UserCredential> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.pipe(map(user => user !== null && user.uid !== 'undefined'));
  }

  logout() {
   this.afAuth.auth.signOut();
  }

}

