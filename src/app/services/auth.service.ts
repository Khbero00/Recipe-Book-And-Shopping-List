
import {map, switchMap,  filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable ,  from, of } from 'rxjs';
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
   return this.user.pipe(switchMap(userAuth => {
        if (userAuth) {
          return this.afs.doc(`users/${userAuth.uid}`).valueChanges()
        } else {
          return of(false);
        }
      }))
  }

  emailSignUp(email: string, password: string) {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  login(email: string, password: string): Observable<auth.UserCredential> {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.pipe(map(user => user !== null && user.uid !== 'undefined'));
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

