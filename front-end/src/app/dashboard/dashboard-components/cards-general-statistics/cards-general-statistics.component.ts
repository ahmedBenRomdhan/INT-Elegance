import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/user/model/user';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';
import { DashboardService } from '../../service/dashboard.service';
import { completedStatus, inProgressStatus, newStatus } from 'src/app/project/utils/variables';

@Component({
  selector: 'app-cards-general-statistics',
  templateUrl: './cards-general-statistics.component.html',
  styleUrls: ['./cards-general-statistics.component.scss']
})
export class CardsGeneralStatisticsComponent implements OnInit {
  card1: string = 'Employés'
  card2: string = 'Nouvaux Projets'
  card3: string = 'Projets En Cours'
  card4: string = 'Projets Cloturés'
  employees: number = 0
  newProjects: number = 0
  completedProjects: number = 0
  inProgressProjects: number = 0

  constructor(public dataService: DataService, private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    const params = {
      newStatus: newStatus,
      inProgressStatus: inProgressStatus,
      completedStatus: completedStatus,
    };
    this.dashboardService.getStatistcsProject(params).subscribe((response) => {      
      this.newProjects = response.newProjects
      this.inProgressProjects = response.inProgressProjects
      this.completedProjects = response.completedProjects
    })

    // @ts-ignore
    this.dataService.getCollection(new User(), '/countUsers')
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore 
          if (response) {
            this.employees = response.countUsers
          }
        });
  }
}
