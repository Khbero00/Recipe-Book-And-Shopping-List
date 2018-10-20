import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { from, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from '@myapp-models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<any>;
  public isLoggedIn: boolean = false;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { 
    this.user = afAuth.authState;
  }
  
  getUser(): Observable<any> {
   return this.user.switchMap(userAuth => {
        if (userAuth) {
          return this.afs.doc(`users/${userAuth.uid}`).valueChanges()
        } else {
          return of(false);
        }
      })
  }

  emailSignUp(email: string, password: string) {
    return Observable.fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  login(email: string, password: string): Observable<auth.UserCredential> {
    return Observable.fromPromise(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.map(user => user !== null && user.uid !== 'undefined');
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

