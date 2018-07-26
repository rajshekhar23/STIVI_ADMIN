import { ListGroupComponent } from './list-group/list-group.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Group Master'
    },
    children: [
      {
        path: 'list-group',
        component: ListGroupComponent,
        data: {
          title: 'List Group'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupmasterRoutingModule { }
