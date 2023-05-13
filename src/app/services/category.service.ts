import { Category } from './../model/category.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Progress } from '../model/progress.model';

const API = environment.API

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private categoryDeletedSource = new BehaviorSubject<boolean>(false);
  categoryChange$ = this.categoryDeletedSource.asObservable();

  onCategoryChange(){
    this.categoryDeletedSource.next(true);
  }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${API}/category/all`, this.httpOptions);
  }

  getCategory(categoryId: any): Observable<Category>{
    return this.http.get<Category>(`${API}/category/${categoryId}`, this.httpOptions);
  }

  createCategory(category: any): Observable<Category>{
    let body = JSON.stringify(category);
    return this.http.post<Category>(`${API}/category/register`, body, this.httpOptions);
  }

  deleteCategory(id): Observable<any>{
    return this.http.delete<any>(`${API}/category/${id}`, this.httpOptions);
  }

  getProgress(): Observable<Progress>{
    return this.http.get<Progress>(`${API}/category/progress`, this.httpOptions);
  }

}
