import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../model/task.model';
import { DatePipe } from '@angular/common';

const API = environment.API

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private taskSource = new BehaviorSubject<boolean>(false);
  taskChange$ = this.taskSource.asObservable();

  onTaskChange(){
    this.taskSource.next(true);
  }

  createTask(taskForm): Observable<any>{
    const body = JSON.stringify({
      description: taskForm.description,
      categoryId: taskForm.categoryId,
      initialDate: this.datePipe.transform(taskForm.initialDate, 'dd-MM-yyyy'),
      deadline: this.datePipe.transform(taskForm.deadline, 'dd-MM-yyyy'),
      priority: taskForm.priority
    });
    return this.http.post<any>(`${API}/task`, body, this.httpOptions);
  }

  deleteTask(id): Observable<any>{
    return this.http.delete<any>(`${API}/task/${id}`, this.httpOptions);
  }

  getTask(id): Observable<Task>{
    return this.http.get<Task>(`${API}/task/${id}`, this.httpOptions);
  }

  updateTask(body): Observable<any>{
    return this.http.put<any>(`${API}/task`, body, this.httpOptions);
  }

  changeTaskStatus(taskId): Observable<any>{
    return this.http.put<any>(`${API}/task/changeTaskStatus/${taskId}`, this.httpOptions);
  }

}
