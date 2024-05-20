import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Role } from '../model/role';
import { AddRoleComponent } from '../add-role/add-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { DeleteRoleComponent } from '../delete-role/delete-role.component';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { DataService } from '../../../services/data.service';
import { noDataFound, addButton, role } from 'src/app/utils/variables';
import { roleDescriptionColumn, roleNameColumn, rolesCard, searchRolePlaceholder } from '../../utils/variables';
import { addRolesPermission, editRolesPermission, deleteRolesPermission } from 'src/app/utils/permissions';

@Component({
    selector: 'app-list-role',
    templateUrl: './list-role.component.html',
    styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {

    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

    dataSource!: MatTableDataSource<Role>;
    displayedColumns = ['name', 'description', 'action'];

    roles: Role[] = [];
    noDataFound = noDataFound
    addButton = addButton
    rolesCard = rolesCard
    searchRolePlaceholder = searchRolePlaceholder

    roleNameColumn = roleNameColumn
    roleDescriptionColumn = roleDescriptionColumn

    addRolesPermission = addRolesPermission
    editRolesPermission = editRolesPermission
    deleteRolesPermission = deleteRolesPermission

    role = role

    constructor(private dataService: DataService, private authServ: AuthenticationService, breakpointObserver: BreakpointObserver, public dialog: MatDialog) {
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
            this.displayedColumns = result.matches ?
                ['name', 'description', 'action'] :
                ['name', 'description', 'action'];
        });
        this.getRolesList();
    }

    ngOnInit(): void {
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getRolesList() {
        // @ts-ignore
        this.dataService.getCollection(new Role(), null)
            .pipe()
            .subscribe(
                (response: { roles: any; }) => {
                    // @ts-ignore
                    if (response) {
                        // @ts-ignore
                        this.roles = response;
                        this.dataSource = new MatTableDataSource(this.roles);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                });
    }

    openAddDialog() {
        const dialogRef = this.dialog.open(AddRoleComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.getRolesList();
            this.searchInput.nativeElement.value = '';
        });
    }

    openEditDialog(row: any) {
        const dialogRef = this.dialog.open(EditRoleComponent, {
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getRolesList()
            this.searchInput.nativeElement.value = '';
        });
    }

    openDeleteDialog(obj: any) {
        const dialogRef = this.dialog.open(DeleteRoleComponent, {
            data: obj
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getRolesList();
            this.searchInput.nativeElement.value = '';
        })
    }

    hasPermission(path: string): boolean {
        const user = this.authServ.getUser()
        const permissions = user.role.permissions.map((permission: any) => permission.path)
        if (permissions.includes(path))
            return true
        else return false
    }
}
