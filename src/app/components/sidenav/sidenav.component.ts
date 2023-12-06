import { Component, OnInit } from '@angular/core';
import { INavbarData, fadeInOut } from './helper';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { afterLoginData, beforeLoginData } from './nav-data';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  navDataBeforeLogin: INavbarData[] = beforeLoginData;
  navDataAfterLogin: INavbarData[] = afterLoginData;
  navBar: BehaviorSubject<INavbarData[]> = new BehaviorSubject<INavbarData[]>([]);
  multiple: boolean = false;

  constructor(
    public router: Router,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.updateNavData();

    // Subscribe to login/logout events
    this.loginService.getLoginStatusChangeObservable().subscribe(() => {
      this.updateNavData();
    });
  }
  updateNavData(): void {
    if (this.loginService.isUserLogin()) {

      this.navBar.next(afterLoginData)
    } else {
      this.navBar.next(beforeLoginData);
    }
  }


  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navDataBeforeLogin.concat(this.navDataAfterLogin)) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  public userLogout() {
    if (this.loginService.isUserLogin()) {
      this.confirmLogout().then((result) => {
        if (result.isConfirmed) {
          this.logout();
          this.logoutSuccessfully();
        }
      });
    }
  }

  // Function to confirm user logout
  confirmLogout(): Promise<any> {
    return Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      return result;
    });
  }

  public logoutSuccessfully() {
    Swal.fire({
      icon: 'success',
      title: 'Logout Successful!',
      text: 'You have been logged out.',
      showConfirmButton: false,
      timer: 2000 // Display the alert for 2 seconds
    });
  }


  // Function to logout the user
  logout() {
    this.loginService.logOut();
    this.router.navigate(['']);
  }

}
