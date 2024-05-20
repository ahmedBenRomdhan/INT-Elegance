import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { AppsRoutingModule } from './apps-routing.module';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { ChatService } from './chat/chat.service';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LinkifyPipe } from './chat/linkify.pipe';

import { ContactInfoComponent } from './contact-info/contact-info.component';
import {  TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ChatComponent, LinkifyPipe, ContactInfoComponent, ],
  imports: [
    CommonModule,
    AppsRoutingModule,
    DemoMaterialModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers:[ChatService]
})
export class AppsModule { }
