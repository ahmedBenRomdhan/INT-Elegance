import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Phase } from '../model/phase';
import { AddPhaseComponent } from '../add-phase/add-phase.component';
import { EditPhaseComponent } from '../edit-phase/edit-phase.component';
import { DeletePhaseComponent } from '../delete-phase/delete-phase.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { AddUserProjectComponent } from '../../project/add-user-project/add-user-project.component';
import { User } from 'src/app/core/user/model/user';
import { backlog, completedStatus, inProgressStatus, newStatus, otherTasks } from 'src/app/project/utils/variables';
import { UserDetailsComponent } from 'src/app/core/user/user-details/user-details.component';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { addPhasessPermission, editPhasesPermission, deletePhasesPermission, getUserPermission, affectUsersProjectsPermission } from 'src/app/utils/permissions';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { noDataFound } from 'src/app/utils/variables';

@Component({
  selector: 'app-list-phase',
  templateUrl: './list-phase.component.html',
  styleUrls: ['./list-phase.component.scss']
})
export class ListPhaseComponent implements OnInit {


  @Input() projectId: any;
  sidePanelOpened = true;
  panelOpenState = false;

  phaseList: Phase[] = [];
  originalPhaseList: Phase[] = [];

  selectedPhase: Phase = Object.create(null);
  searchText = '';
  usersList: User[] = [];
  projectName: string = ''
  projectStatus: string = ''

  backlog = backlog
  otherTasks = otherTasks

  newStatus = newStatus
  completedStatus = completedStatus

  addPhasessPermission = addPhasessPermission
  editPhasesPermission = editPhasesPermission
  deletePhasesPermission = deletePhasesPermission
  getUserPermission = getUserPermission
  affectUsersProjectsPermission = affectUsersProjectsPermission


  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource = new MatTableDataSource<Phase>();
  noData = noDataFound
  constructor(public dataService: DataService, public dialog: MatDialog, private authServ: AuthenticationService,) {
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  ngOnInit(): void {
    this.getPhasesList()
  }

  onSelect(phase: Phase): void {
    this.selectedPhase = phase;
  }

  getPhasesList() {
    this.phaseList = []
    // @ts-ignore
    this.dataService.getCollection(new Phase(), '/' + this.projectId)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            response.forEach(phase => {
              this.phaseList.push(phase)
              this.usersList = phase.project.users;
              this.projectName = phase.project.name;
              this.projectStatus = phase.project.status;
              switch (phase.status) {
                case newStatus: {
                  return phase.color = 'success';
                  break;
                }
                case inProgressStatus: {
                  return phase.color = 'warning';
                  break;
                }
                case completedStatus: {
                  return phase.color = 'megna';
                  break;
                }
              }
            }
            )
          }
          this.dataSource = new MatTableDataSource(this.phaseList);
          this.obs = this.dataSource.connect();
          this.originalPhaseList = [...this.phaseList];
          this.selectedPhase = this.phaseList[0]
        })
  }

  openAddDialog(projectId: string) {
    const dialogRef = this.dialog.open(AddPhaseComponent, {
      width: '50%',
      data: projectId
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPhasesList()
      this.searchText = '';
    });
  }

  openEditDialog(phase: any) {
    const dialogRef = this.dialog.open(EditPhaseComponent, {
      width: '50%',
      data: phase
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPhasesList()
      this.searchText = '';
    });
  }

  openDeleteDialog(phase: any) {
    const dialogRef = this.dialog.open(DeletePhaseComponent, {
      data: phase
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPhasesList();
      this.searchText = '';
    })
  }

  openAddUserProjectDialog(projectId: string) {
    const dialogRef = this.dialog.open(AddUserProjectComponent, {
      height: '48%',
      width: '32%',
      data: projectId
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPhasesList()
      this.searchText = '';
    });
  }

  openProfileDialog(user: any) {
    if (this.hasPermission(getUserPermission)) {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '40%',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchText = '';
    })
  }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case newStatus:
        return 'label label-success';
      case inProgressStatus:
        return 'label label-warning';
      case completedStatus:
        return 'label label-megna';
      default:
        return 'course-header';
    }
  }

  hasPermission(path: string): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes(path))
      return true
    else return false
  }

  applyFilter(event: Event): void {

    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);

    if (filterValue) {

      this.phaseList = this.filterPhase(filterValue, this.phaseList);
      this.dataSource = new MatTableDataSource(this.phaseList);
      this.obs = this.dataSource.connect();
      this.phaseList = [...this.originalPhaseList];

    }
    else {
      this.phaseList = [...this.originalPhaseList];
      this.dataSource = new MatTableDataSource(this.phaseList);
      this.obs = this.dataSource.connect();
    }
  }

  filterPhase(v: string, list: Phase[]): Phase[] {
    return list.filter(x => x.title.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }
}
