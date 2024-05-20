import { Injectable } from '@angular/core';

import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService  {

  private socket!: Socket;

  constructor( private authenticationService: AuthenticationService) {
    this.authenticationService.getToken().subscribe(token => {
    this.socket = io(environment.apiUrl, {
      auth: {
        token: localStorage.getItem('accessToken')
      },
    });


  })
}

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  getSocket(): Socket {
    return this.socket;
  }
  getUsers(): Observable<any> {


    return new Observable((observer) => {
      this.socket.on('users', (user: any) => {
        observer.next(user);
        console.log(user)
      });
    });
  }
}
