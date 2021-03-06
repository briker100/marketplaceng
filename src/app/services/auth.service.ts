import { Injectable } from '@angular/core';
import { RegisterUser } from '../models/RegisterUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../models/Token';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

const Api_Url = 'https://efamarketplacewebapi.azurewebsites.net';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userInfo = new Subject<{}>();
  isLoggedIn = new Subject<Boolean>();

  constructor(private _http: HttpClient, private _router: Router) { }

  register(regUserData: RegisterUser) {
    return this._http.post(`${Api_Url}/api/Account/Register`, regUserData);
  }

  login(loginInfo) {
    console.log(loginInfo);
    const str = `grant_type=password&username=${encodeURI(loginInfo.email)}&password=${encodeURI(loginInfo.password)}`;

    return this._http.post(`${Api_Url}/Token`, str).subscribe( (token: Token) => {
      localStorage.setItem('id_token', token.access_token);
      localStorage.setItem('user', token.userName);
      this.isLoggedIn.next(true);

      this._router.navigate(['/IndexPage']);
      window.location.reload();
    });
  }

  currentUser(): Observable<Object> {
    if (!localStorage.getItem('id_token')) { return new Observable(observer => observer.next(false)); }

    return this._http.get(`${Api_Url}/api/Account/UserInfo`, { headers: this.setHeader() });
  }

  adminCheck(): Observable<Object> {
    if (!localStorage.getItem('id_token')) { return new Observable(observer => observer.next(false)); }

    return this._http.get(`${Api_Url}/api/Account/adminCheck`, { headers: this.setHeader() });
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn.next(false);

    this._http.post(`${Api_Url}/api/Account/Logout`, { headers: this.setHeader() });
    this._router.navigate(['/login']);
    window.location.reload();
  }

  private setHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('id_token')}`);
  }
}

