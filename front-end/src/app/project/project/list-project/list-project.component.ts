import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Project } from '../model/project';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { AddProjectComponent } from '../add-project/add-project.component';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { MatSelectChange } from '@angular/material/select';
import { ProjectService } from '../service/project.service';
import { Legend, legendStatus } from '../../utils/legend';
import { NB, applicatioWeb, applicationMobile, completedStatus, electronicSystem, embeddedSystem, errorEndDateMessage, inProgressStatus, newStatus } from 'src/app/project/utils/variables';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { noDataFound, role } from 'src/app/utils/variables';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../../utils/format-date';
import { addProjectsPermission, editProjectsPermission, deleteProjectsPermission, getProjectDetailsPermission, trailProjectPermission, affectUsersProjectsPermission } from 'src/app/utils/permissions';

@Component({
  selector: 'app-list-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})

export class ListProjectComponent implements OnInit {

  projectList: Project[] = [];
  originalProjectList: Project[] = [];
  searchListByAttribute: Project[] = [];
  selectedType = 'All';
  selectedStatus = 'All';
  startDate: Date | null = null;
  endDate: Date | null = null;
  startDateChanged: string | null = ""
  endDateChanged: string | null = ""
  errorMessage: string | null = null;
  panelOpenState: boolean = false;
  legend: string = "Légende"
  legends: Legend[] = legendStatus;
  newStatus = newStatus
  inProgressStatus = inProgressStatus
  completedStatus = completedStatus
  applicatioWeb = applicatioWeb
  applicationMobile = applicationMobile
  embeddedSystems = embeddedSystem
  electronicSystems = electronicSystem
  role = role

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource = new MatTableDataSource<Project>();
  noData = noDataFound
  minEndDate: any
  errorEndDateMessage = errorEndDateMessage
  errorEndDate = false
  maxStartDate: any
  NB = NB

  addProjectsPermission = addProjectsPermission
  editProjectsPermission = editProjectsPermission
  deleteProjectsPermission = deleteProjectsPermission
  getProjectDetailsPermission = getProjectDetailsPermission
  trailProjectPermission = trailProjectPermission
  affectUsersProjectsPermission = affectUsersProjectsPermission

  constructor(private dataService: DataService, private authServ: AuthenticationService,
    public dialog: MatDialog, private projectService: ProjectService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getProjectsList();
    this.changeDetectorRef.detectChanges();
  }

  getProjectsList() {
    if (this.authServ.getUser().role.name === this.role) {
      // @ts-ignore
      this.dataService.getCollection(new Project(), null)
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            if (response) {
              this.projectList = response
              this.dataSource = new MatTableDataSource(this.projectList);
              this.dataSource.paginator = this.paginator;
              this.obs = this.dataSource.connect();
              this.originalProjectList = [...this.projectList];
            }
          });
    }
    else {
      this.projectList = []
      // @ts-ignore
      this.dataService.getCollection(new Project(), '/' + this.authServ.getUser().id)
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            if (response) {
              response.forEach((project: any) => {
                this.projectList.push(project.project)
              });
              this.dataSource = new MatTableDataSource(this.projectList);
              this.dataSource.paginator = this.paginator;
              this.obs = this.dataSource.connect();
              this.originalProjectList = [...this.projectList];
            }
          });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '50%',
      height: '59%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProjectsList()
      this.searchInput.nativeElement.value = '';
    });
  }

  openEditDialog(row: any) {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      data: row,
      width: '50%',
      height: '59%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProjectsList()
      this.searchInput.nativeElement.value = '';
    });
  }

  openDeleteDialog(obj: any) {
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProjectsList();
      this.searchInput.nativeElement.value = '';
    })
  }

  searchProjects() {
    if (this.authServ.getUser().role.name === this.role) {
      // @ts-ignore
      this.dataService.getCollection(new Project(), `/search?type=${this.selectedType}&status=${this.selectedStatus}&startDate=${this.startDate ? this.startDateChanged : null}&endDate=${this.endDate ? this.endDateChanged : null}`)
        .pipe()
        .subscribe(
          (response) => {
            // @ts-ignore
            if (response) {
              this.projectList = response
              this.searchListByAttribute = [...this.projectList]
              this.dataSource = new MatTableDataSource(this.projectList);
              this.dataSource.paginator = this.paginator;
              this.obs = this.dataSource.connect();
            }
          });
    }
    else {
      // @ts-ignore
      this.dataService.getCollection(new Project(), '/searchByUser/' + this.authServ.getUser().id + `/?type=${this.selectedType}&status=${this.selectedStatus}&startDate=${this.startDate ? this.startDateChanged : null}&endDate=${this.endDate ? this.endDateChanged : null}`)
        .pipe()
        .subscribe(
          (response) => {
            this.projectList = []
            // @ts-ignore
            if (response) {
              response.forEach((project: any) => {
                this.projectList.push(project.project)
              });
              this.searchListByAttribute = [...this.projectList]
              this.dataSource = new MatTableDataSource(this.projectList);
              this.dataSource.paginator = this.paginator;
              this.obs = this.dataSource.connect();
            }
          });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      if (this.searchListByAttribute.length > 0)
        this.projectList = this.filterProject(filterValue, this.searchListByAttribute);
      else
        this.projectList = this.filterProject(filterValue, this.projectList);

      this.dataSource = new MatTableDataSource(this.projectList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
      this.projectList = [...this.originalProjectList];

    }
    else {
      this.projectList = [...this.originalProjectList];
      this.dataSource = new MatTableDataSource(this.projectList);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    }
  }

  filterProject(v: string, list: Project[]): Project[] {
    return list.filter(x => x.name.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.type.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.status.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.startDate.toString().indexOf(v.toString()) !== -1 || x.endDate.toString().indexOf(v.toString()) !== -1);
  }

  applyTypeFilter(event: MatSelectChange) {
    this.selectedType = event.value;
    this.searchProjects();
  }

  applyStatusFilter(event: MatSelectChange) {
    console.log(event)
    this.selectedStatus = event.value;
    this.searchProjects();
  }

  applyDateFilter(): void {
    if (this.startDate) {
      this.startDateChanged = this.startDate.toISOString();
      this.minEndDate = this.startDateChanged
    }
    else {
      this.startDateChanged = null;
      this.minEndDate = null
    }
    if (this.endDate) {
      this.endDateChanged = this.endDate.toISOString();
      this.maxStartDate = this.endDateChanged
      if (this.startDate && this.endDate < this.startDate) {
        this.errorEndDate = true;
      }
    }
    else {
      this.endDateChanged = null;
      this.maxStartDate = null
    }
    this.searchProjects()
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  hasPermission(path: string): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes(path))
      return true
    else return false
  }

  getStatusClass(status: string): string {
    console.log(status)
    switch (status) {

      case newStatus:
        return 'course-header new';
      case inProgressStatus:
        return 'course-header in-progress';
      case completedStatus:
        return 'course-header completed';
      default:
        return 'course-header';
    }
  }

  resetFields() {
    this.startDate = null
    this.minEndDate = null
    this.endDate = null
    this.maxStartDate = null
    this.selectedType = 'All';
    this.selectedStatus = 'All';
    this.searchProjects();

  }
}
