import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class HasPermissionGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router,
        ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const permissions = this.authService.getUser()?.role.permissions.map((permission: any) => permission.path);
        const isAuthorized = permissions.includes(route.data.permission);
        if (!isAuthorized) {
            this.router.navigate(['/unauthorized'])
        }

        return isAuthorized || false;
    }
}