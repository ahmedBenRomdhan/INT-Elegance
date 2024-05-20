import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { TaskColumn } from 'src/app/project/model/task-column';
import { Project } from 'src/app/project/project/model/project';
import { DeleteTaskComponent } from 'src/app/project/task/delete-task/delete-task.component';
import { Task } from 'src/app/project/task/model/task';
import { TaskService } from 'src/app/project/task/service/task.service';
import { DataService } from 'src/app/services/data.service';
import { canceledStatus, completedStatus, inProgressStatus, newStatus } from 'src/app/project/utils/variables';
import { environment } from 'src/environments/environment';
import { addChildTasksPermission, editTasksPermission, deleteTasksPermission, trailTasksPermission } from 'src/app/utils/permissions';
import { noDataFound } from 'src/app/utils/variables';

@Component({
  selector: 'app-cards-user-statistics',
  templateUrl: './cards-user-statistics.component.html',
  styleUrls: ['./cards-user-statistics.component.scss']
})
export class CardsUserStatisticsComponent implements OnInit {
  card1: string = 'Total Projets'
  card2: string = 'Total Tickets'
  card3: string = 'Tickets  A Faire'
  card4: string = 'Tickets  En Cours'

  totalProjects: number = 0
  totalTickets: number = 0
  newTickets: number = 0
  inProgressTickets: number = 0

  idUser: any
  tasksList: Task[] = [];
  Columns = [
    { name: 'ID', active: true },
    { name: 'Type', active: true },
    { name: 'Nom', active: true },
    { name: 'Status', active: true },
    { name: 'Priorité', active: false },
    { name: 'Date Début', active: false },
    { name: 'Date Fin', active: true },
    { name: 'Temps Estimé', active: false },
    { name: 'Temps Passé', active: false },
    { name: 'Réalisation', active: true },
    { name: 'Assigné à', active: false },
    { name: 'Projet', active: true },
    { name: 'Actions', active: true },
  ];
  displayedColumns = ['ID', 'Type', 'Nom', 'Status', 'Priorité', 'Date Début', 'Date Fin', 'Temps Estimé', 'Temps Passé', 'Réalisation', 'Assigné à', 'Projet', 'Actions'];

  columnShowHideList: TaskColumn[] = [];
  panelOpenState: boolean = false;

  dataSource = new MatTableDataSource<Task>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  projectList: Project[] = []
  selectedProject = 'All';
  label = 'Projet'
  newStatus = newStatus
  inProgressStatus = inProgressStatus
  completedStatus = completedStatus
  canceledStatus = canceledStatus

  addChildTasksPermission = addChildTasksPermission
  editTasksPermission = editTasksPermission
  deleteTasksPermission = deleteTasksPermission
  trailTasksPermission = trailTasksPermission
  noDataFound = noDataFound

  constructor(private dialog: MatDialog, private authService: AuthenticationService, private dataService: DataService,
    private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.idUser = this.authService.getUser().id
    this.getData()
    this.initializeColumnProperties();
    this.getTasksList()
    this.getListProject()
  }
  getData() {
    // @ts-ignore
    this.dataService.getCollection(new Task(), '/statistics/' + this.idUser)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            this.inProgressTickets = response.inProgressTasks
            this.newTickets = response.newTasks
          }
        });
    // @ts-ignore
    this.dataService.getCollection(new Project(), '/counProjectsByUser/' + this.idUser)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            this.totalProjects = response.counProjects
          }
        });

  }
  btnTasksClick(val: string): any {
    this.dataSource.filter = val.trim().toLowerCase();
  }

  initializeColumnProperties() {
    this.Columns.forEach((element, index) => {
      this.columnShowHideList.push(
        { possition: index, name: element.name, isActive: element.active }
      );
    });
    this.toggleColumn({ position: 4, name: 'Priorité', isActive: false });
    this.toggleColumn({ position: 5, name: 'Date Début', isActive: false })
    this.toggleColumn({ position: 7, name: 'Temps Estimé', isActive: false })
    this.toggleColumn({ position: 8, name: 'Temps Passé', isActive: false })
    this.toggleColumn({ position: 10, name: 'Assigné à', isActive: false })

  }

  toggleColumn(column: any) {
    if (column.isActive) {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name);
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name);
      }
    } else {
      let i = this.displayedColumns.indexOf(column.name);
      let opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined;
    }
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  getTasksList() {
    //@ts-ignore
    this.dataService.getCollection(new Task(), '/getUserTasks/' + this.idUser)
      .pipe()
      .subscribe((result) => {
        if (result) {
          this.totalTickets = result.length

          this.tasksList = result;
          this.dataSource = new MatTableDataSource(this.tasksList);
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  getUrl(id: string) {
    if (id) {
      const url = `${environment.gitLabBaseUrl}${environment.gitlabProjectId}/${environment.gitlabCommitPath}${id}`;
      window.open(url, '_blank');
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Task':
        return 'bg-warning';
      case 'Bug':
        return 'bg-danger';
      case 'Feature':
        return 'bg-primary';
      case 'Remark':
        return 'bg-secondary';
      case 'Item':
        return 'bg-megna';
      case 'Action':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  }

  openDeleteDialog(obj: any) {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTasksList()
    })
  }

  getListProject() {
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
          }
        });
  }

  searchProjects() {
    const params = {
      projectId: this.selectedProject,
      userId: this.idUser
    };
    this.taskService.searchTasksByProject(params).subscribe((data) => {
      this.tasksList = data
      this.dataSource = new MatTableDataSource(this.tasksList);
    })
  }

  applyProjectFilter(event: MatSelectChange) {
    this.selectedProject = event.value;
    this.searchProjects();
  }

  viewProjectDetails(projectId: any) {
    this.router.navigate(['/project/details/' + projectId])

  }

  hasPermission(path: string): boolean {
    const user = this.authService.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)

    if (permissions.includes(path))
      return true
    else return false
  }

  getUserProjects(){
    this.router.navigate(['/list_projects'])
  }
}
