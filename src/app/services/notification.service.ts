import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../model/notification.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const API = environment.API

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAllNotifications(): Observable<Notification[]>{
    return this.http.get<Notification[]>(`${API}/notification/all`, this.httpOptions);
  }

  setAllAsVisualized(){
    return this.http.patch(`${API}/notification/setAllAsVisualized`, this.httpOptions);
  }

  setNotificationAsClicked(id){
    return this.http.patch(`${API}/notification/setNotificationAsClicked/` + id, this.httpOptions);
  }
}
