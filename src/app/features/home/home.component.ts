import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = "Welcome To Chef Shop";
  images: string[];

  screenHeight: string;
  screenWidth: string;

  constructor() { }

  ngOnInit() {
    this.screenHeight = (window.innerHeight - 56).toString();
    this.screenWidth = window.innerWidth.toString();

    this.images = [1, 2, 3].map(() => `https://source.unsplash.com/${this.screenWidth}x${this.screenHeight}/?food&t=${Math.random()}`);
  }
}
