import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';

const API = environment.API

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  signup(user: User): Observable<any>{
    return this.http.post<any>(`${API}/user/register`, user, this.httpOptions);
  }

  updateForgotPassword(user: User): Observable<any>{
    return this.http.put<any>(`${API}/user/updateForgotPassword`, user, this.httpOptions);
  }

  public verifyExistentUser(email: string): Observable<boolean>{
    return this.http.get<boolean>( `${API}/user/exists?email=${email}`);
  }

  public updateUserData(user: User, email:string): Observable<any>{
    return this.http.put<User>(`${API}/user/updateUserData?email=${email}`, user);
  }

  public changeLoggedUserPassword(user: User, email:string): Observable<any>{
    return this.http.put<User>(`${API}/user/updateLoggedUserPassword?email=${email}`, user);
  }

  public clearUserRandomCodeAndRole(email:string): Observable<any>{
    sessionStorage.removeItem('userRole');
    let user = new User()
    return this.http.put<User>(`${API}/user/clearUserRandomCodeAndRole?email=${email}`, user);
  }

  public verifyUserAuthorities(email: string): Observable<boolean>{
    return this.http.get<boolean>( `${API}/user/userHasAuthorities?email=${email}`);
  }

  public changeLanguage(language: any): Observable<any>{
    const body = JSON.stringify({
      language
    })
    return this.http.put<any>(`${API}/user/language`, body, this.httpOptions);
  }

  public changeTheme(theme: any): Observable<any>{
    const body = JSON.stringify({
      theme
    })
    return this.http.put<any>(`${API}/user/theme`, body, this.httpOptions);
  }

}
