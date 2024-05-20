import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';
import { completedStatus, inProgressStatus, newStatus } from 'src/app/project/utils/variables';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-status-list-projects',
  templateUrl: './status-list-projects.component.html',
  styleUrls: ['./status-list-projects.component.scss']
})
export class StatusListProjectsComponent implements OnInit {

  roleUser: string = ''
  role: string = 'admin'
  idUser: any

  title: string = "Projets"
  legend: string = "Classement selon le status "
  result: any[] = [];
  view: any[] = [390, 334];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  legendTitle: string = 'Légende';

  colorScheme = {
    domain: ['#26c6da', '#ffb22b', '#009688']
  };

  constructor(public dataService: DataService, private authService: AuthenticationService,private translate:TranslateService) {
    Object.assign(this, this.result);
  }

  ngOnInit(): void {
    this.roleUser = this.authService.getUser().role.name
    this.idUser = this.authService.getUser().id
    this.getData()
  }

  getData() {
    if (this.roleUser === this.role) {
      // @ts-ignore
      this.dataService.getCollection(new Project(), '/statisticsByStatus')
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            if (response) {
              this.result = response.sort((a: any, b: any) => {
                const statusOrder = [newStatus, inProgressStatus, completedStatus];
                return statusOrder.indexOf(a.name) - statusOrder.indexOf(b.name);
              });
            }
          });
    }
    else {
      // @ts-ignore
      this.dataService.getCollection(new Project(), '/statisticsByStatusByUser/'+this.idUser)
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            if (response) {
              this.result = response.sort((a: any, b: any) => {
                const statusOrder = [newStatus, inProgressStatus, completedStatus];
                return statusOrder.indexOf(a.name) - statusOrder.indexOf(b.name);
              });
            }
          });
    }
  }

}

