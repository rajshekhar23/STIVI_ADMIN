import { FirestoreDataService } from './../../firestore-data.service';
import { Router } from '@angular/router';
import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbCalendarIslamicUmalqura } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {
  userId: any;
  userName: any;
  userRole: any;
  userEmail: any;
  userMobile: any;
  userIsDeleted: any;
  userCreateDate: any;
  userCreateBy: any;
  isNewUser = true;
  isUserDeleted: any;
  password: any;
  errorMessage = '';
  isAdmin: any;
  error: { name: string, message: string } = { name: '', message: '' };
  resetPassword = false;

  constructor(private authService: AuthService, private router: Router, private _firestoreDataService: FirestoreDataService) {
  }

  ngOnInit() {
    this.userRole = '';
    this.isAdmin = false;
    this.isUserDeleted = 'N';
    if (localStorage.getItem('isAdmin') === 'TRUE') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  onSignUp(): void {
    this.clearErrorMessage();
    if (this.validateForm(this.userId, this.password)) {
      this.userCreateBy = localStorage.getItem('username');
      this.userCreateDate = new Date().getTime();
      console.log(this.userId);
      console.log(this.userName);
      console.log(this.userRole);
      console.log(this.userEmail);
      console.log(this.userMobile);
      console.log(this.userIsDeleted);
      console.log(this.userCreateDate);
      console.log(this.userCreateBy);
      this.authService.signUpWithEmail(this.userId, this.password)
        .then(() => {
          this._firestoreDataService.registerUser(this.userId, this.userName, this.userRole,
            this.userEmail, this.userMobile, this.userIsDeleted, this.userCreateDate, this.userCreateBy);
          this.router.navigate(['/dashboard']);
        }).catch(_error => {
          this.error = _error;
        });
     }
  }

  clearAll() {
    this.userId = '';
    this.userName = '';
    this.userRole = '';
    this.userEmail = '';
    this.userMobile = '';
    this.userIsDeleted = '';
    this.userCreateDate = '';
    this.userCreateBy = '';
  }

  validateForm(email: string, password: string): boolean {
    if (email.length === 0) {
      this.errorMessage = 'Please enter Email!';
      return false;
    }
    if (password.length === 0) {
      this.errorMessage = 'Please enter Password!';
      return false;
    }
    if (password.length < 6) {
      this.errorMessage = 'Password should be at least 6 characters!';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  login() {
    this.router.navigate(['/login']);
  }
  isValidMailFormat(email: string) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if ((email.length === 0) && (!EMAIL_REGEXP.test(email))) {
      return false;
    }

    return true;
  }
}
