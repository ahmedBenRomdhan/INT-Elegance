import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/core/user/model/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Project } from '../model/project';
import Swal from 'sweetalert2';
import { matTooltipClose, noDataFound } from 'src/app/utils/variables';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-user-project',
  templateUrl: './add-user-project.component.html',
  styleUrls: ['./add-user-project.component.scss']
})
export class AddUserProjectComponent implements OnInit {

  users = new FormControl('');
  filteredUsers: Observable<User[]>;

  usersList: User[] = [];
  usersProject: User[] = [];
  usersToAdd: User[] = [];
  search: string[] = []
  user: number = 0
  matTooltipClose = matTooltipClose
  selectedUser: any;
  noDataFound = noDataFound
  
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddUserProjectComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.getUsers()

    this.filteredUsers = this.users.valueChanges.pipe(
      startWith(''),
      map(user => (user ? this._filterUsers(user) : this.usersToAdd.slice())),
    );
  }
  ngOnInit(): void {
  }

  getUsers() {
    // @ts-ignore
    this.dataService.getCollection(new User(), '/available/' + this.data)
      .pipe()
      .subscribe(
        (response) => {
          // @ts-ignore
          if (response) {
            // @ts-ignore
            this.usersToAdd = response;
          }
        });
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.usersToAdd.filter(user => user.firstName.toLowerCase().includes(filterValue) || user.lastName.toLowerCase().includes(filterValue));
  }

  submit() {
    if (this.selectedUser) {
      const userId = this.selectedUser.id;

      // @ts-ignore
      const projectModel = new Project();
      projectModel.setId(this.data);
      let project = {
        user: userId
      };
      // @ts-ignore
      this.dataService.putItem(projectModel, '/affectUsersProject', project)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.closeDialog()
            const Toast = Swal.mixin({
              toast: true,
              width: 390,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Utilisateur Ajouté avec Succès.'
            })
            this.search = []
            this.users = new FormControl('')
            this.user = 0
          }
        })
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
  
  onUserOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedUser = this.usersToAdd.find(user => this.getUserFullName(user) === event.option.value);
    this.users.setValue('');

  }
  
  removeUser() {
    this.selectedUser = null;
  }
  
}
