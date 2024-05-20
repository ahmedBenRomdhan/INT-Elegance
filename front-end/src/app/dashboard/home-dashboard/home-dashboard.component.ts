import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Socket } from 'socket.io-client';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';
import { labelChooseProject, noDataFound, role } from 'src/app/utils/variables';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit {

  label = labelChooseProject
  projectList: Project[] = []
  selectedValue = new FormControl(null);
  projectId: any
  noResult = noDataFound
  roleUser: string = ''
  role = role
  idUser: any
socket:Socket
  constructor(private dataService: DataService, private authService: AuthenticationService,  private socketService:SocketService) {

    this.socket = this.socketService.getSocket()
    console.log(this.socket)
  }

  ngOnInit(): void {
    this.roleUser = this.authService.getUser().role.name
    this.idUser = this.authService.getUser().id
    this.getListProject()
    this.socketService.getUsers().subscribe((res:any)=>{
      console.log(res)
    })
  }
  getListProject() {
    if (this.roleUser === this.role) {
      // @ts-ignore
      this.dataService.getCollection(new Project(), null)
        .pipe()
        .subscribe(
          (response: any) => {
            // @ts-ignore
            if (response) {
              this.projectList = response
              this.selectedValue.setValue(this.projectList[0]?.id);
              this.projectId = this.projectList[0]?.id
            }
          });
    }
    else {
      // @ts-ignore
      this.dataService.getCollection(new Project(), '/' + this.idUser)
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            if (response) {
              response.forEach((project: any) => {
                this.projectList.push(project.project)
              });
              this.selectedValue.setValue(this.projectList[0]?.id);
            }
          });
    }
  }
  changeProject(value: any) {
    this.projectId = value
  }
}
