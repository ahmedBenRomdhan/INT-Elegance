import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { Observable, Subject } from 'rxjs';

import { AuthenticationService } from 'src/app/authentication/authentication.service';

import { SocketService } from '../../services/socket.service';
import { Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket
  private connectionReadySubject = new Subject<void>();
  private connectionReady$ = this.connectionReadySubject.asObservable();
  constructor(
          private authService: AuthenticationService,
           private http: HttpClient,
           private socketService: SocketService
           ) {
            this.socket = this.socketService.getSocket()
           }


joinConver(conversationId:any, socketId: any ){

  this.socket.emit('join-conversation', { conversationId, socketId })
}

getMessages(): Observable<any> {

  return new Observable((observer) => {
    this.socket.on('send-message', (message: any) => {
      observer.next(message);

    });
  });
}
searchAllUsers(term: string){
    return this.http.get(`${environment.apiUrl}user/search-users?term=${term}`)
}

viewedStatus(Ids:any[]){
  console.log(Ids)
  return this.http.put(`${environment.apiUrl}message/viewed`,{Ids})
}

userHasConnected(): Observable<any> {

  return new Observable((observer) => {
    this.socket.on('user-connected', (users: any) => {
      observer.next(users);
      console.log(users)
    });
  });
}
userDisconnected(): Observable<any> {

  return new Observable((observer) => {
    this.socket.on('user-disconnected', (userId: any) => {
      observer.next(userId);
    });
  });
}
getUsers(): Observable<any> {


  return new Observable((observer) => {
    this.socket.on('users', (user: any) => {
      observer.next(user);
      console.log(user)
    });
  });
}
  getConversationById(id:any){
    return this.http.get(`${environment.apiUrl}message/${id}/getOne`)
  }
  sendMessage(conversationId:any,message: any, destinationId:any): void {

    console.log(message, conversationId)
    this.socket.emit('new-message',{ conversationId, message, destinationId});
  }

  addMessage(conversationId:any, messageBody:any, fileMetaData: any){

    console.log('Sending data:', conversationId, messageBody, fileMetaData);
     return this.http.post(`${environment.apiUrl}message/send`, {conversationId, message_body: messageBody, fileMetaData})
  }

   createConversation(id:any){
    return this.http.post(`${environment.apiUrl}message/create`,{destination: id})
  }
  getUserById(id:any){
    return this.http.get(`${environment.apiUrl}user/${id}/getOne`)
  }

  getUserConversation(){
    return this.http.get(`${environment.apiUrl}message/get`)
  }
  userTyping(conversationId: string, isTyping: boolean, userId: any): void {

    this.socket.emit('user-typing', { conversationId, isTyping, userId });
  }
  getTypingStatus(): Observable<any> {

    return new Observable((observer) => {
      this.socket.on('typing-status', (data: any) => {
        observer.next(data);

      });
    });
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${environment.apiUrl}files/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  getFiles(): Observable<any> {
    return this.http.get(`${environment.apiUrl}files`);
  }

  sendNotif(notif:any){
    return this.http.post(`${environment.apiUrl}notification/send`, notif)
  }

}
