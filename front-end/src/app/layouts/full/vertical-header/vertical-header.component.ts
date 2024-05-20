import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { User } from 'src/app/core/user/model/user';
import { profileLabel, logoutLabel } from 'src/app/utils/variables';
import { editUserProfilePermission } from 'src/app/utils/permissions';
import { SocketService } from 'src/app/services/socket.service';
import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { Notification } from './notification.interface';

@Component({
  selector: 'app-vertical-header',
  templateUrl: './vertical-header.component.html',
  styleUrls: []
})

export class VerticalAppHeaderComponent implements OnInit{
  socket: Socket;
  notif: any;
  userNotificationSet: Set<string> = new Set();
  mymessages: Notification[] = [];
  constructor(private translate: TranslateService,
              private authenticationService: AuthenticationService,
              private socketService: SocketService,
              private http: HttpClient,
              private notificationService: NotificationService,
              private router: Router)
  {
   translate.setDefaultLang('en');
   const storedLanguage = localStorage.getItem('selectedLanguage');
   if (storedLanguage) {
     this.selectedLanguage = JSON.parse(storedLanguage);
     this.translate.use(this.selectedLanguage.code);
 }
     this.user = authenticationService.getUser()
     this.socket= this.socketService.getSocket()

 }
  ngOnInit(): void {
    console.log(this.socket)

    this.notificationService.getNotif().subscribe((res: any) => {
      res.message.forEach((e: any) => {
        if (e.treated === false && !this.userNotificationSet.has(e.from)) {
          const isoDateString = e.createdAt; // Assuming e.createdAt is in ISO 8601 format
          const dateObject = new Date(isoDateString);

          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',  // You can use 'numeric' or '2-digit'
            month: 'long',    // You can use 'numeric', '2-digit', 'short', 'long'
            day: 'numeric',   // You can use 'numeric' or '2-digit'
            hour: '2-digit',  // You can use 'numeric' or '2-digit'
            minute: '2-digit',// You can use 'numeric' or '2-digit'
            second: '2-digit' // You can use 'numeric' or '2-digit'
          };
          const formattedDateTime = dateObject.toLocaleString(undefined, options);

          const messagenotif = {
            id: e.id,
            useravatar: `${e.useravatar}`,
            status: 'online',
            from: `${e.from}`,
            subject: e.subject,
            time: formattedDateTime,
            treated: e.treated
          };

          this.mymessages.push(messagenotif);
          this.userNotificationSet.add(e.from);
          console.log(this.mymessages)
        }
      });
    });
      this.notificationService.getNotification().subscribe((res:any)=>{
        console.log(res)
        if(res.notification.to === this.authenticationService.getUser().id &&  !this.userNotificationSet.has(res.notification.from)){
          const isoDateString = res.currentDateTime; // Assuming e.createdAt is in ISO 8601 format
          const dateObject = new Date(isoDateString);

          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',  // You can use 'numeric' or '2-digit'
            month: 'long',    // You can use 'numeric', '2-digit', 'short', 'long'
            day: 'numeric',   // You can use 'numeric' or '2-digit'
            hour: '2-digit',  // You can use 'numeric' or '2-digit'
            minute: '2-digit',// You can use 'numeric' or '2-digit'
            second: '2-digit' // You can use 'numeric' or '2-digit'
          };
          const formattedDateTime = dateObject.toLocaleString(undefined, options);
          const messagenotif ={
            useravatar: `${res.notification.useravatar}`,
            status:'online',
            from: `${res.notification.from}`,
            subject: res.notification.subject,
            time: formattedDateTime,
            id: res.id,
            treated: false
          }
          this.mymessages.push(messagenotif)
          this.userNotificationSet.add(res.notification.from);
          console.log(this.mymessages)
        }
      })
  }

  public config: PerfectScrollbarConfigInterface = {};
  profileLabel = profileLabel
  logoutLabel = logoutLabel
  editUserProfilePermission = editUserProfilePermission

  // This is for Notifications
  notifications: Object[] = [
    // {
    //   round: 'round-danger',
    //   icon: 'ti-link',
    //   title: 'Launch Admin',
    //   subject: 'Just see the my new admin!',
    //   time: '9:30 AM'
    // },
    // {
    //   round: 'round-success',
    //   icon: 'ti-calendar',
    //   title: 'Event today',
    //   subject: 'Just a reminder that you have event',
    //   time: '9:10 AM'
    // },
  ];

  // This is for Mymessages
  // mymessages: Object[] = [
    // {
    //   useravatar: 'assets/images/users/1.jpg',
    //   status: 'online',
    //   from: 'Pavan kumar',
    //   subject: 'Just see the my admin!',
    //   time: '9:30 AM'
    // },
    // {
    //   useravatar: 'assets/images/users/2.jpg',
    //   status: 'busy',
    //   from: 'Sonu Nigam',
    //   subject: 'I have sung a song! See you at',
    //   time: '9:10 AM'
    // },
    // {
    //   useravatar: 'assets/images/users/2.jpg',
    //   status: 'away',
    //   from: 'Arijit Sinh',
    //   subject: 'I am a singer!',
    //   time: '9:08 AM'
    // },
    // {
    //   useravatar: 'assets/images/users/4.jpg',
    //   status: 'offline',
    //   from: 'Pavan kumar',
    //   subject: 'Just see the my admin!',
    //   time: '9:00 AM'
    // }
  // ];

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  }

  public languages: any[] = [{
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  },
  {
    language: 'Français',
    code: 'fr',
    icon: 'fr'
  },
  ]

  user: User;



  getNotif(): Observable<any> {


    return new Observable((observer) => {
      this.socket.on('notification', (notification: any) => {
        observer.next(notification);
        console.log(notification)
      });
    });
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


changeLanguage(lang: any): void {
  this.translate.use(lang.code);
  this.selectedLanguage = lang;
  localStorage.setItem('selectedLanguage', JSON.stringify(lang));
  window.location.reload();
  }
handleMessageClick(clickedMessage:any)
{
 console.log(clickedMessage)
 this.router.navigate(['/chat'])
 const clickedIndex = this.mymessages.findIndex((message) => message.id === clickedMessage.id);

    if (clickedIndex !== -1) {
      // Remove the clicked message from mymessages array
      this.mymessages.splice(clickedIndex, 1);

      // Remove the user from userNotificationSet
      this.userNotificationSet.delete(clickedMessage.from);

      // You can also call a method from the notification service to remove the notification
      this.notificationService.removeNotification(clickedMessage.id).subscribe((response) => {
        console.log('Notification removed:', response);
      });

      // Update mymessages to reflect the changes
      this.mymessages = [...this.mymessages]; // This triggers Angular's change detection
    }
  }
}







