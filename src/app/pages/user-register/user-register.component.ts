import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
[x: string]: any;


  signupForm!: FormGroup;
  public user: User = new User();

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      password: ['', [Validators.required,]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required]],
    });
  }

  userRegistration() {
    if (this.signupForm.valid) {
      this.userService.addUser(this.user).subscribe(
        (data) => {
          console.log(data);
          this.showSuccessSweetAlert('User Registration Success !!');
        },
        (error) => {
          if (error.status === 409) {
            this.showErrorSnackbar('User is already registered with this name.');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'User Registration Failed',
              text: 'Something went wrong',
            });
          }
        }
      );
    } else {
      this.showErrorSweetAlert('Invalid Form. Please fill in all required fields.');
    }
  }

  showSuccessSweetAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  showErrorSweetAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  showSuccessSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}