import { UsersListComponent } from './users-list/users-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserNewComponent } from './user-new/user-new.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User Master'
    },
    children: [
      {
        path: 'list-users',
        component: UsersListComponent,
        data: {
          title: 'List Users'
        }
      },
      {
        path: 'user-new',
        component: UserNewComponent,
        data: {
          title: 'New User'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersmasterRoutingModule { }
