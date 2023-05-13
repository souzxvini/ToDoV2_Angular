import { environment } from './../../environments/environment';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

const API = environment.API

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private router: Router,
    private translateService: TranslateService
  ) { }

  public authenticate(user: any): Observable<any>{
    return this.http.post<any>( `${API}/auth`, user, this.httpOptions).pipe(map((resp) => {
      sessionStorage.setItem('userEmail', resp.email);
      sessionStorage.setItem('userName', resp.name);
			sessionStorage.setItem('token', 'Bearer ' + resp.jwttoken);
			localStorage.setItem('Language', resp.userLanguage);
			localStorage.setItem('ToDoV2Theme', resp.userTheme);
      this.translateService.use(resp.userLanguage);
      this.document.getElementById('theme').setAttribute('href', '../assets/css/themeStyle/' + localStorage.getItem('ToDoV2Theme') + '.css');
			return resp;
    }));
  }

  public confirmAuthenticatedUser(user: User): Observable<any>{
    return this.http.post<any>( `${API}/auth/confirmAuthenticatedUserData`, user);
  }

	signout() {
		sessionStorage.removeItem('userEmail');
		sessionStorage.removeItem('userName');
		sessionStorage.removeItem('token');

		this.router.navigate(['login']);
	}

  isUserSignedin() {
		return sessionStorage.getItem('token') !== null;
	}

	getSignedinUserEmail() {
		return sessionStorage.getItem('userEmail') as string;
	}

  getSignedinUserName() {
		return sessionStorage.getItem('userName') as string;
	}

	getToken() {
		return sessionStorage.getItem('token') as string;
	}

  sendEmailCode(email: string){
    return this.http.get<any>(`${API}/auth/sendEmailCode?email=${email}`)
  }

}
