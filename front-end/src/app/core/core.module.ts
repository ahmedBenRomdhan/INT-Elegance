import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { DeleteRoleComponent } from './role/delete-role/delete-role.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from '../demo-material-module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListUserComponent } from './user/list-user/list-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { ImportUserComponent } from './user/import-user/import-user.component';
import { ProfileUserComponent } from './user/profile-user/profile-user.component';
import { FileUploadModule } from 'ng2-file-upload';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { TrailUserComponent } from './user/trail-user/trail-user.component';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateDatePipe } from './user/trail-user/translate-date.pipe';


@NgModule({
  declarations: [
    ListRoleComponent,
    AddRoleComponent,
    EditRoleComponent,
    DeleteRoleComponent,
    ListUserComponent,
    AddUserComponent,
    EditUserComponent,
    ImportUserComponent,
    ProfileUserComponent,
    UserDetailsComponent,
    TrailUserComponent,
    TranslateDatePipe],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FlexLayoutModule,
    DemoMaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FileUploadModule,
    MatSlideToggleModule,
    TranslateModule
  ]
})



export class CoreModule {


 }
