import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/project/project/model/project';
import { DataService } from 'src/app/services/data.service';
import { canceledStatus, completedStatus, inProgressStatus, integratedStatus, newStatus, resolvedStatus } from 'src/app/project/utils/variables';

@Component({
  selector: 'app-progress-tasks-project',
  templateUrl: './progress-tasks-project.component.html',
  styleUrls: ['./progress-tasks-project.component.scss']
})
export class ProgressTasksProjectComponent implements OnInit {

  title: string = 'Taches'
  legend: string = 'Classement selon status des taches'

  projectId: any;
  get id(): string {
    return this.projectId;
  }

  @Input()
  set id(id: string) {
    this.projectId = id;
    this.getTasks();
  }
  tasks: any = []
  view: any[] = [800, 255];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  animation: boolean = true;
  colorScheme = {
    domain: ['#1E88E5FF', '#FFB22BFF', '#FC4B6CFF', '#26C6DAFF', '#00897BFF','#a0aec4']
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.initializeTasksTab()
  }
  initializeTasksTab() {
    this.tasks = [
      {
        name: newStatus,
        value: 0
      },
      {
        name: inProgressStatus,
        value: 0
      },
      {
        name: resolvedStatus,
        value: 0
      },
      {
        name: integratedStatus,
        value: 0
      },
      {
        name: completedStatus,
        value: 0
      },
      {
        name: canceledStatus,
        value: 0
      },
    ];
  }

  getTasks() {
    if (this.projectId) {
      // @ts-ignore
      const project = new Project();
      project.setId(this.projectId);
      // @ts-ignore
      this.dataService.getItem(project, '/tasks')
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore 
            if (response) {
              this.initializeTasksTab();
              // Mettre à jour les valeurs des tâches dans l'ordre souhaité
              this.tasks = this.tasks.map((task: any) => {
                const matchingTask = response.find((responseTask: any) => responseTask.name === task.name);
                if (matchingTask) {
                  return {
                    name: matchingTask.name,
                    value: matchingTask.value
                  };
                }
                return task;
              });
            }
          }
        );
    }
  }

}
