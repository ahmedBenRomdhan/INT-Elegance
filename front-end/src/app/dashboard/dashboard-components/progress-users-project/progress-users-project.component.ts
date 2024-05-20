import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Phase } from 'src/app/project/phase/model/phase';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-progress-users-project',
  templateUrl: './progress-users-project.component.html',
  styleUrls: ['./progress-users-project.component.scss']
})
export class ProgressUsersProjectComponent implements OnInit {

  list: any[] = [];
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Collaborateurs';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Heures';
  legendTitle: string = 'Légende';
  position: string = 'below'
  
  colorScheme = {
    domain: ['#26c6da', '#ffb22b']
  };
  projectId: any;
  phaseId: any;

  get id(): string {
    return this.projectId;
  }

  @Input()
  set id(id: string) {
    this.projectId = id;
    this.getPhasesList(id)
  }

  label: string = 'Choisir Phase'
  phasesList: Phase[] = []
  selectedValue = new FormControl();
  noResult: string = 'Aucun résultat trouvé'

  constructor(private dataService: DataService) {
    Object.assign(this, this.list)
  }
  ngOnInit(): void {
    this.getPhasesList(this.projectId)
  }

  getData(phaseId: any) {
    // @ts-ignore
    const project = new Project()
    project.setId(this.projectId)
    // @ts-ignore
    this.dataService.getCollection(project, '/' + phaseId + '/calculateUsersProgress')
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore 
          if (response) {
            this.list = response
          }
        });
  }

  getPhasesList(projectId: any) {
    if(projectId){
    // @ts-ignore
    this.dataService.getCollection(new Phase(), '/' + projectId)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.phasesList = response
            this.selectedValue.setValue(this.phasesList[2]?.id);
            this.list = []
            this.getData(this.phasesList[2]?.id)
          }
        })
      }
  }

  changePhase(id: any) {
    this.phasesList.forEach((phase => {
      if (phase.id === id) {
        this.phaseId = phase.id
        this.getData(this.phaseId);
      }
    }));
  }

}