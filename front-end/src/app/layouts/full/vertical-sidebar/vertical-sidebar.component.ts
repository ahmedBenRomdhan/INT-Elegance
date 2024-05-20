import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';


import { MenuItems } from '../../../shared/menu-items/menu-items';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { User } from 'src/app/core/user/model/user';
import { editUserProfilePermission } from 'src/app/utils/permissions';

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: ['./vertical-sidebar.component.scss']
})

export class VerticalAppSidebarComponent implements OnDestroy, OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  firstName: string = "";
  lastName: string = "";
  image: string = "";
  private _mobileQueryListener: () => void;
  status = true;

  itemSelect: number[] = [];
  parentIndex = 0;
  childIndex = 0;

  setClickedRow(i: number, j: number) {
    this.parentIndex = i;
    this.childIndex = j;
  }
  subclickEvent() {
    this.status = true;
  }
  scrollToTop() {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0
    });
  }
  user: User;
  editUserProfilePermission = editUserProfilePermission

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private authenticationService: AuthenticationService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.user = authenticationService.getUser()

  }

  ngOnInit(): void {
    const user = this.authenticationService.getUser()
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.image = user.image;
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onClick() {
    this.authenticationService.logout();
  }

  hasPermission(path: any): boolean {
    const user = this.authenticationService.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)
    if (permissions.includes(path))
      return true
    else return false
  }

  hasAllPermission(items: any): boolean {
    const user = this.authenticationService.getUser()
    const permissions = user.role.permissions.map((permission: any) => permission.path)

    let cpt = 0
    items.forEach((perm: any) => {
      if (permissions.includes(perm.permission))
        cpt = cpt + 1
    });

    if (cpt <= items.length && cpt > 0)
      return true
    return false
  }
}
