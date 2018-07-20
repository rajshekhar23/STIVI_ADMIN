import { FirestoreDataService } from './../../firestore-data.service';
import { AuthService } from './../../auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  isNewUser = true;
  email = '';
  password = '';
  errorMessage = '';
  users: any;
  error: { name: string, message: string } = { name: '', message: '' };

  resetPassword = false;

  constructor(public authService: AuthService, private router: Router, private _firestoreService: FirestoreDataService) {
  }

  ngOnInit() {
    this.users = [];
  }

  checkUserInfo() {
    if (this.authService.isUserEmailLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  onLoginEmail(): void {
    this.clearErrorMessage();

    if (this.validateForm(this.email, this.password)) {
      this.authService.loginWithEmail(this.email, this.password)
        .then(() => {
          this.router.navigate(['/dashboard']);
          this.checkIsAdmin(this.email);
        })
        .catch(_error => {
          this.error = _error;
          this.error.message = _error.code === 'auth/user-not-found' ? 'Invalid user ' : _error.message;
          this.router.navigate(['/']);
        });
    }
  }

  checkIsAdmin(email) {
    this._firestoreService.checkIsAdmin(email).subscribe(data => {
        console.log(data);
        data.forEach(function(data1) {
          if (data1.userRole === 'STIVI_ADMIN') {
            localStorage.setItem('isAdmin', 'TRUE');
          } else {
            localStorage.setItem('isAdmin', 'FALSE');
          }
        });
    });
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

  isValidMailFormat(email: string) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if ((email.length === 0) && (!EMAIL_REGEXP.test(email))) {
      return false;
    }

    return true;
  }
}
