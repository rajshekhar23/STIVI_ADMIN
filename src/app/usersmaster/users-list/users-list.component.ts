import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreDataService } from './../../firestore-data.service';
import { User } from './../../models/users';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  usersList: User[];
  isUsersListEmpty: boolean;
  ngModelRef: any;
  userIsDeleted: any;
  user: User;
  isUpdate: boolean;
  constructor(private _firestoreDataService: FirestoreDataService, private modalService: NgbModal) { }

  ngOnInit() {
    this.userIsDeleted = 'N';
    this.isUpdate = false;
    this.isUsersListEmpty = false;
    this.getAllUsers();
  }

  getAllUsers() {
    this._firestoreDataService.getAllUsersList().subscribe( data => {
      this.usersList = data;
      this.usersList.forEach( users => {
        users.userCreateDate = new Date(Number(users.userCreateDate)).toLocaleString();
        if  (users.userUpdateDate) {
          users.userUpdateDate = new Date(Number(users.userUpdateDate)).toLocaleString();
        }
      });
      if (this.usersList.length === 0) {
        this.isUsersListEmpty = true;
      }
    });
  }

  closeModal() {
    this.ngModelRef.close();
    this.isUpdate = false;
  }

  updateUser() {
    this.user.userIsDeleted = this.userIsDeleted === 'Y' ? true : false;
    this.user.userUpdateDate = new Date().getTime().toString();
    console.log(this.user);
    this.user.userUpdateBy = localStorage.getItem('username');
    this.user.userCreateDate = '1532632229027';
    this.user.userCreateBy = 'Rajshekhar';
/*     this.user.userCreateDate = '1532632229027';
    this.user.userCreateBy = 'Rajshekhar'
 */    console.log(this.user);
    this._firestoreDataService.updateUser(this.user);
    this.getAllUsers();
    this.ngModelRef.close();
    this.user = null;
    this.isUpdate = false;
  }

  removeUser(userDetails) {
    console.log(userDetails);
    if (confirm('Are you sure to remove user')) {
      this._firestoreDataService.removeUser(userDetails.id);
    }
  }

  editUser(userDetails, content) {
    this.user = userDetails;
    this.userIsDeleted = this.user.userIsDeleted ? 'Y' : 'N';
    this.user.userCreateDate = Date.parse(this.user.userCreateDate).toString();
    this.ngModelRef = this.modalService.open(content, { centered: true});
    this.isUpdate = true;
  }

}
