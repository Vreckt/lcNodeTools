import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss']
})
export class AuthentificationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('user')) {
      this.router.navigate(['../']);
    }
  }

  onConnect() {
    sessionStorage.setItem('user', 'connected');
    this.router.navigate(['server_manage']);
  }

}
