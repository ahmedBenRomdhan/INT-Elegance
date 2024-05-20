import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  params = new HttpParams();

  constructor(private http: HttpClient) { }

  searchTasks(data: any) {
    this.params = this.params.set("status", data.status)
      .set("type", data.type)
      .set("priority",data.priority)
      .set("startDate",data.startDate)
      .set("endDate",data.endDate)
      .set("phaseId",data.phaseId)

    return this.http.get<any>(environment.apiUrl + 'task/search', { params: this.params })
  }
  searchTasksByProject(data: any) {
    this.params = this.params.set("projectId", data.projectId)
      .set("userId",data.userId)

    return this.http.get<any>(environment.apiUrl + 'task/searchByProject', { params: this.params })

  }
}
