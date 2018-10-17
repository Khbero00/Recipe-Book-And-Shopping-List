import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) { 
    this.user = afAuth.authState;
  }

  login(email: string, password: string): Observable<any> {
    return Observable.fromPromise(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.map(user => user && user.uid !== 'undefined');
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

