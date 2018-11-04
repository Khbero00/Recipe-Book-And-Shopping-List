import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email: string;
  username: string;

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit() {
    this.email = localStorage.getItem('userEmail');
    this.username = localStorage.getItem('username');
    console.log(this.email);
    console.log(this.username);
  }

  logOut() {
    this.router.navigate(['/']);
    this.authService.logout();
  }
}
