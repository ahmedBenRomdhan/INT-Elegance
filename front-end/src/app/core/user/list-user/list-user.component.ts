import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from '../model/user';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { DataService } from '../../../services/data.service';
import { ImportUserComponent } from '../import-user/import-user.component';
import { UserService } from '../service/user.service';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { ThemePalette } from '@angular/material/core';
import Swal from 'sweetalert2';
import { deleteUserMessage, emailColumn, errorListRolePermission, nameColumn, phoneNumberColumn, restoreUserMessage, roleColumn, searchUserPlaceholder, usersCard } from '../../utils/variables';
import { addButton, historyButton, importButton, matTooltipProfil, noDataFound, role } from 'src/app/utils/variables';
import { addUsersPermission, importUsersilePermission, editUsersPermission, desactivateUsersPermission, restoreUsersPermission, getUserPermission, trailUsersPermission, listRolesPermission } from 'src/app/utils/permissions';
import { SocketService } from 'src/app/services/socket.service';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  nameColumn = nameColumn
  emailColumn = emailColumn
  phoneNumberColumn = phoneNumberColumn
  roleColumn = roleColumn
  cardName = usersCard
  searchUserPlaceholder = searchUserPlaceholder
  noDataFound = noDataFound
  addButton = addButton
  importButton = importButton
  historyButton = historyButton
  matTooltipProfil = matTooltipProfil

  addUsersPermission = addUsersPermission
  importUsersilePermission = importUsersilePermission
  editUsersPermission = editUsersPermission
  desactivateUsersPermission = desactivateUsersPermission
  restoreUsersPermission = restoreUsersPermission
  getUserPermission = getUserPermission
  trailUsersPermission = trailUsersPermission
  listRolesPermission = listRolesPermission

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  dataSource!: MatTableDataSource<any>;
  displayedColumns = ['name', 'email', 'phoneNumber', 'roleId', 'action'];

  users: any = [];
  searchKey: string = '';
  color: ThemePalette = 'warn';
  role = role

  countUsersAdmin = 0

  constructor(private dataService: DataService, private authServ: AuthenticationService,
    public dialog: MatDialog, private userService: UserService,) {
    this.getUsersList();
  }

  ngOnInit(): void {
    this.getUsersRoleAdmin();

  }

  getUsersList() {
    // @ts-ignore
    this.dataService.getCollection(new User(), null)
      .pipe()
      .subscribe(
        (response: { users: any; }) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.users = response;
            this.users.forEach((element:any) => {
              if (element.deletedAt !== null)
                element.deletedAt = false
              else
                element.deletedAt = true
            });
            this.dataSource = new MatTableDataSource(this.users);
            this.dataSource.paginator = this.paginator;
          }
        });
  }

  applyFilter(filterValue: string): void {
    

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    if (this.hasPermission(listRolesPermission)) {
      const dialogRef = this.dialog.open(AddUserComponent, {
        width: '50%',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getUsersList()
        this.searchInput.nativeElement.value = '';
      });
    }
    else{
      const Toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'warning',
        text:errorListRolePermission,
        position: 'bottom',
        width: 620,
      })
    }
  }

  openEditDialog(user: any) {
    if (user.deletedAt) {
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '50%',
        data: user
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getUsersList()
        this.getUsersRoleAdmin
        this.searchInput.nativeElement.value = '';
      });
    }
  }

  openProfileDialog(user: any) {
      const dialogRef = this.dialog.open(UserDetailsComponent, {
        width: '40%',
        data: user
      });
      dialogRef.afterClosed().subscribe(result => {
        this.searchInput.nativeElement.value = '';
      })
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(ImportUserComponent, {
      width: '41.8%',
      height: '45%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsersList()
      this.searchInput.nativeElement.value = '';
    });
  }

  hasPermission(path: string): boolean {
    const user = this.authServ.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes(path))
      return true
    else return false
  }

  search() {
    if (this.searchKey) {
      this.userService.searchUsers(this.searchKey).subscribe(response => {
        this.users = response;
        //    this.dataSource = new MatTableDataSource(this.users);
      });
    } else {
      this.users = [];
    }
  }

  deleteUser(user: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      width: 500,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    // @ts-ignore
    const userModel = new User();
    userModel.setId(user.id);
    if (!user.deletedAt) {
      // @ts-ignore
      this.dataService.getItem(userModel, '/restore/').subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: restoreUserMessage,
          })
          this.getUsersList()
          this.getUsersRoleAdmin()
        }
      });
    }
    else {
      // @ts-ignore
      this.dataService.deleteItem(userModel, '/delete', user.id).subscribe({
        next: () => {
          Toast.fire({
            icon: 'warning',
            title: deleteUserMessage
          })
          this.getUsersList()
          this.getUsersRoleAdmin()
        }
      });
    }
  }

  getUsersRoleAdmin() {
    // @ts-ignore
    this.dataService.getCollection(new User(), `/countUsersByRole?role=${role}`)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.countUsersAdmin = response;
          }
        });
  }

  checkRole(user: any) {
    const hasDeactivatePermission = this.hasPermission(desactivateUsersPermission);
    const hasRestorePermission = this.hasPermission(restoreUsersPermission);
  
    if (hasDeactivatePermission && hasRestorePermission) {
      if (!user.role || user.role.name !== role) {
        return true;
      }
    }
  
    return false;
  }
}
