import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupmasterRoutingModule } from './groupmaster-routing.module';
import { ListGroupComponent } from './list-group/list-group.component';

@NgModule({
  imports: [
    CommonModule,
    GroupmasterRoutingModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [ListGroupComponent]
})
export class GroupmasterModule { }
