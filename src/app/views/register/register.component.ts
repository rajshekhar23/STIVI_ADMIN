import { FirebaseAuth } from 'angularfire2';
import { FirestoreDataService } from './../../firestore-data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  isNewUser = true;
  email = '';
  username: '';
  mobile: '';
  password = '';
  role: string;
  errorMessage = '';
  error: { name: string, message: string } = { name: '', message: '' };
  resetPassword = false;

  constructor(private authService: AuthService, private router: Router, private _firestoreDataService: FirestoreDataService) {
      this.role = 'SELECT_ROLE';
      console.log(this.authService.currentUserId);
      console.log(this.authService.currentUserName);
  }

  ngOnInit() {
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  checkUserInfo() {
    if (this.authService.isUserEmailLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onSignUp(): void {
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password, this.mobile, this.username)) {
       this.authService.signUpWithEmail(this.email, this.password)
        .then(() => {
          this._firestoreDataService.registerUser(this.email, this.password, this.mobile, this.username, this.role);
          this.router.navigate(['/dashboard']);
        }).catch(_error => {
          this.error = _error;
          this.router.navigate(['/']);
        });
     }
  }

  validateForm(email: string, password: string, mobile: string, username: string): boolean {
/*     if (username.length === 0) {
      this.errorMessage = 'Please enter Username!';
      return false;
    }

    if (mobile.length === 0) {
      this.errorMessage = 'Please enter Mobile!';
      return false;
    }
 */
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
