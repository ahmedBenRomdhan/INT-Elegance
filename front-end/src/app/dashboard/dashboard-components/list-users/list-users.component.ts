import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/core/user/model/user';
import { UserDetailsComponent } from 'src/app/core/user/user-details/user-details.component';
import { inProgressStatus } from 'src/app/project/utils/variables';
import { DataService } from 'src/app/services/data.service';
import { noDataFound } from 'src/app/utils/variables';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  title: string = "Employés"
  legend: string = "Classement selon le nombre des projets"

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<User>;

  displayedColumns = ['name', 'total projects', 'projets en cours', 'action'];
  users: User[] = [];
  status = inProgressStatus
  noData = noDataFound

  constructor(public dataService: DataService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getUsersList()
  }

  getUsersList() {
    // @ts-ignore
    this.dataService.getCollection(new User(), `/countProjects?status=${this.status}`)
      .pipe()
      .subscribe(
        // @ts-ignore
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore            
            this.users = response;
            this.dataSource = new MatTableDataSource(this.users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
  }

  openProfileDialog(user: any) {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '40%',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

}
