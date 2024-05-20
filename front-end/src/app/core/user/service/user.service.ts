import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  params = new HttpParams();

  constructor(private http: HttpClient) { }

  //IMPORT USERS
  importUsers(data:any){
    return this.http.post(environment.apiUrl + 'users/import', data);
  }

  searchUsers(data: any) {
    this.params = this.params.append("search", data);
    return this.http.get<any>(environment.apiUrl + 'user/searchUsers', { params: this.params })
  }
}
