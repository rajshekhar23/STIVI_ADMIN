import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersmasterRoutingModule } from './usersmaster-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UserNewComponent } from './user-new/user-new.component';
import { FormsModule } from '../../../node_modules/@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    UsersmasterRoutingModule
  ],
  declarations: [UsersListComponent, UserNewComponent]
})
export class UsersmasterModule { }
