import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-cards-project',
  templateUrl: './cards-project.component.html',
  styleUrls: ['./cards-project.component.scss']
})
export class CardsProjectComponent implements OnInit {

  card1: string = "Assigné à"
  card2: string = "Progrès"
  card3: string = "Temps Passé"
  assignedTo: number = 0
  realisation: number = 0
  passedTime: number = 0
  estimatedTime: number = 0

  projectId: any;

  get id(): string {
    return this.projectId;
  }

  @Input()
  set id(id: string) {
    this.projectId = id;
    this.getProject()
  }

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  getProject() {
    if (this.projectId) {
      // @ts-ignore
      const project = new Project()
      project.setId(this.projectId)
      // @ts-ignore
      this.dataService.getItem(project, '/getOne')
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore 
            if (response)
              this.assignedTo = response.users.length
          });

      // @ts-ignore
      this.dataService.getItem(project, '/calculateProgress')
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore 
            if (response)
              this.realisation = response.realisation
            this.passedTime = response.passedTime
            this.estimatedTime = response.estimatedTime
          });
    }
  }
}
