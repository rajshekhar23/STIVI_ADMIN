import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersmasterRoutingModule } from './usersmaster-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UserNewComponent } from './user-new/user-new.component';

@NgModule({
  imports: [
    CommonModule,
    UsersmasterRoutingModule
  ],
  declarations: [UsersListComponent, UserNewComponent]
})
export class UsersmasterModule { }
