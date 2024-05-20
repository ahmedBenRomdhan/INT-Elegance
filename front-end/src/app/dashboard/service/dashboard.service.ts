import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  params = new HttpParams();

  constructor(private http: HttpClient) { }

  getStatistcsProject(data: any) {
    this.params = this.params.set("newStatus", data.newStatus)
    .set("inProgressStatus", data.inProgressStatus)
    .set("completedStatus", data.completedStatus)

    return this.http.get<any>(environment.apiUrl + 'project/statistics', { params: this.params })
  }
  
}
