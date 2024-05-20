import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  socket:Socket;
  constructor(private http: HttpClient, private socketService: SocketService) {
    this.socket=this.socketService.getSocket()
  }


getNotif(){
  return this.http.get(`${environment.apiUrl}notification/get`)
}

getNotification(): Observable<any> {

    return new Observable((observer) => {
      this.socket.on("notif", (data:any)=>{
        observer.next(data);
        console.log(data)
      })


      });

}

removeNotification(id:any){
  return this.http.patch(`${environment.apiUrl}notification/${id}/edit`, {});
}

}
