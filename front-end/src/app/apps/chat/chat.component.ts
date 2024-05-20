import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { messages } from './chat-data';
import { ChatService } from './chat.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SocketService } from 'src/app/services/socket.service';
import { Socket } from 'socket.io-client';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { LoadingMessage } from './loadingMessage';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('scrollableContent', { static: false })
  scrollableContent: ElementRef = Object.create(null);
  showOneToOne: boolean = true;
  showProject: boolean = false;
  connectedUsersIds: any[] = [];
  users: any;
  room: string = 'test';
  sidePanelOpened = true;
  msg = '';
  userConversations: any;
  focusConversation: any;
  searchTerms: string;
  loadingSearch: boolean;
  searchedUsers: any;
  loading: boolean;
  chat: any = [];
  conv = {};
  oneToOneConversations: any[] = [];
  projectConversations: any[] = [];
  selectedTab: string = 'chat';
  userFirstName: any;
  userLastName: any;
  userPhoto: any;
  resolvedUser: any;
  resolvedUserImage: any;
  socket: Socket;
  typingUsers: Set<string> = new Set<string>();
  isTyping: boolean = false;
  selectedMessage: any;
  messagesIds :any[] = []
  existingUserIds: any[] = [];
  filteredResponse: any[] = [];
  private destroy$ = new Subject<void>();
  fileName: any;
  fileToSend: any;
  private isFirstVisit = true;
  public lastRefreshedTime: string ='';
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  messageInfo = '';
  fileInfos?: Observable<any>;
  isFontBold = false;
  isBold = false;
  lastMessage :any;
  img: any
  private usersSubscription: Subscription | undefined;
  // tslint:disable-next-line - Disables all
  messages: Object[] = messages;
  typingStatusSubscription: Subscription | undefined;
  constructor(
    private chatService: ChatService,
    private authService: AuthenticationService,
    private cd: ChangeDetectorRef,
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.selectedMessage = this.messages[0];
    this.socket = this.socketService.getSocket();
    console.log(this.socket.connected);
    console.log(this.socket);
    this.img =

    this.search = this.search.bind(this);
    this.searchTerms = '';
    this.loadingSearch = false;
    // this.messages = []
    this.userFirstName = this.authService.getUser().firstName.charAt(0).toUpperCase() + this.authService.getUser().firstName.slice(1) ;
    this.userLastName = this.authService.getUser().lastName.charAt(0).toUpperCase() + this.authService.getUser().lastName.slice(1);
    this.userPhoto = this.authService.getUser().image;
    this.loading = true;
  }
  ngAfterViewInit(): void {
console.log('init')

  }

  ngOnDestroy(): void {
    // this.chatService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  @ViewChild('myInput', { static: true }) myInput: ElementRef =
    Object.create(null);
  ngOnInit(): void {

    this.chatService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((users: any) => {
      console.log('1')
      console.log('Users:', users);
      console.log(this.connectedUsersIds);
      // console.log(this.users)
      users.forEach((e: any) => {
        if (!this.connectedUsersIds.includes(e.userid))
          this.connectedUsersIds.push(e.userid);
      });
      console.log(this.connectedUsersIds);
    });


    this.chatService.getUserConversation().subscribe((response: any) => {
      console.log('2')
      console.log(response);
      this.userConversations = response.conversations;
      this.userConversations.forEach((element: any) => {
        if (element.conversation_name == null) {
          this.oneToOneConversations.push(element);
        } else {
          this.projectConversations.push(element);
        }
      });
      console.log(this.oneToOneConversations);
      console.log(this.projectConversations);
      // this.selectedMessage= response.conversations[0]
      console.log(this.userConversations);
      console.log(this.userConversations[0] === this.oneToOneConversations);
      console.log(this.selectedMessage);
      console.log(this.userConversations);
      this.loading = false;
    });


    this.chatService.getMessages().subscribe((message: any) => {
      console.log('3')
      // Check if the message already exists in the array
      const existingMessage = this.selectedMessage.messages.find(
        (m: any) => m.id === message.id
      );
      if (!existingMessage) {
        this.selectedMessage.messages.push(message);
        this.scrollToBottom();
      }
      console.log('selectedMessage:', this.selectedMessage);
      console.log('selectedMessage.messages:', this.selectedMessage.messages);
    });

    this.chatService
      .userHasConnected()
      .pipe(takeUntil(this.destroy$))
      .subscribe((id: any) => {
        console.log('4')
        console.log(id);
        if (!this.connectedUsersIds.includes(id)) {
          this.connectedUsersIds.push(id);
        }

        console.log(this.connectedUsersIds);
      });

    this.chatService
      .userDisconnected()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId: any) => {
        const index = this.connectedUsersIds.indexOf(userId);
        if (index !== -1) {
          this.connectedUsersIds.splice(index, 1);
        }
        console.log(this.connectedUsersIds);
      });
    this.chatService.getTypingStatus().subscribe((data: any) => {

      const { conversationId, isTyping, userId } = data;
      if (isTyping && userId != this.authService.getUser().id) {
        this.typingUsers.add(conversationId);
        console.log(this.typingUsers);
      } else {
        this.typingUsers.delete(conversationId);

      }
    });
    this.fileInfos = this.chatService.getFiles();
    console.log(this.fileInfos)
    this.connected();
  }

  connected() {
    setTimeout(() => {
      console.log(this.socket.connected);
    }, 3000);
  }
  scrollToBottom(): void {
    const element: HTMLElement = this.scrollableContent.nativeElement;
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 10);
    console.log('x');
  }
  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }




  formatDate(date: string): string {
    const formattedDate = new Date(date).toLocaleString();
    return formattedDate;
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    this.fileName = event.target.files[0].name
  }


    upload(): void {
      this.progress = 0;

      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);

        if (file) {
          this.currentFile = file;

          this.chatService.upload(this.currentFile).subscribe(
            (event: any) => {
              console.log(event)

              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
                console.log(this.progress)
              } else if (event instanceof HttpResponse) {
                console.log(event instanceof HttpResponse)
                this.messageInfo = event.body.message;
                // console.log(this.messageInfo)
                // this.fileInfos = this.chatService.getFiles();
              }
            },
            (err: any) => {
              console.log(err);
              this.progress = 0;

              if (err.error && err.error.message) {
                this.messageInfo = err.error.message;
              } else {
                this.messageInfo = 'Could not upload the file!';
              }

              this.currentFile = undefined;
            });

        }

        this.selectedFiles = undefined;
        this.fileName = undefined;
      }
      console.log("z")
    }
    openProfileDialog(user:any){
      console.log(user)
      const dialogRef = this.dialog.open(ContactInfoComponent, {
        width: '40%',
        data: user
      });
      dialogRef.afterClosed().subscribe(result => {
      })
    }

  OnAddMsg(): void {
    this.msg = this.myInput.nativeElement.value;
    console.log(this.selectedMessage.messages)
    if (this.msg !== '' && this.selectedMessage.id ) {
      const loadingMessage : LoadingMessage  = {
        id: uuidv4(),
        message_body: this.msg,
        senderId: this.authService.getUser().id,
        createdAt: new Date(),
      };
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file) {

          console.log(loadingMessage)
          // Upload the file and send the message when the upload is complete
          this.uploadAndSendMessage(file, loadingMessage);
          return;
        }
      }
console.log(this.selectedMessage.users[0])
      const notif = {
        from:this.authService.getUser().firstName+" "+this.authService.getUser().lastName,
        to: this.selectedMessage.users[0].id,
        subject: `${this.authService.getUser().firstName+" "+this.authService.getUser().lastName} has sent you a message`,
        treated: false,
        useravatar: this.authService.getUser().image

      }
      console.log(notif)
      // this.chatService.sendNotif(notif).subscribe()
      this.sendMessage(loadingMessage,this.selectedMessage.users[0].id);
    }
  }

  uploadAndSendMessage(file: File, message: LoadingMessage): void {
    this.chatService.upload(file).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          console.log(this.progress);
          if (this.progress === 100) {
            // When upload is complete, send the message
            message.fileMetadata = {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              fileUrl: `http://${environment.apiUrl}/files/files/` + file.name,
            };
            console.log(message)

            this.sendMessage(message,this.selectedMessage.users[0].id);
          }
        } else if (event instanceof HttpResponse) {
          // ... handle response
        }
      },
      (err: any) => {
        console.log(err);
        // ... handle error
      }
    );
  }

  sendMessage(message: LoadingMessage, destinationId:any): void {
    console.log(message)
    this.selectedMessage.messages.push(message);
    console.log(this.selectedMessage.messages)
    this.chatService.sendMessage(this.selectedMessage.id, message, destinationId);

    this.chatService.addMessage(
      this.selectedMessage.id,
      message.message_body,
      message.fileMetadata
    ).subscribe((res: any) => {
      console.log(res);
    });

    this.resetFormAndScroll();
  }

  resetFormAndScroll(): void {
    this.isTyping = false;
    this.myInput.nativeElement.value = '';
    this.progress = 0;
    this.selectedFiles = undefined;
    this.fileName = undefined;
    this.scrollToBottom();
  }
  createMessageContent(c: any): SafeHtml {
    let content = c.message_body;

    if (c.fileMetadata && c.fileMetadata.fileUrl) {
      const fileTypeToIcon: Record<string, string> = {
        'application/pdf': 'fas fa-file-pdf',
        'application/zip': 'fas fa-file-archive',
        'image/png': 'fas fa-file-image',
        // Add more mappings for other file types if needed
      };

      const iconClass = fileTypeToIcon[c.fileMetadata.fileType] || 'fas fa-file';

      const fileLink = `
        <a  href="${c.fileMetadata.fileUrl}" class="file-link">
           ${c.fileMetadata.fileName}
        </a>
      `;
      content += `${fileLink}`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  indexUserDest(conversationId: any) {
    const index = this.userConversations.findIndex(
      (conversation: any) => conversation.id == conversationId
    );
    const indexUserDest = this.userConversations[index].users.findIndex(
      (user: any) => user._id != this.authService.getUser().id
    );
    return indexUserDest;
  }

  showOneToOneConversations() {
    this.showOneToOne = true;
    this.showProject = false;
  }

  showProjectConversations() {
    this.showOneToOne = false;
    this.showProject = true;
  }

  checkId(id: any) {
    return id === this.authService.getUser().id ? 'odd' : 'even';
  }

  setFocusConversation(conversationid: any, status: any) {
    this.focusConversation = { id: conversationid, status: status };
    //  console.log(this.focusConversation)
  }

  openConver(id: any) {
    console.log(id);
    this.chatService.createConversation(id).subscribe((res: any) => {
      console.log(this.oneToOneConversations);
      console.log(res);
      this.searchTerms = '';
      this.loading = false;
      console.log(this.userConversations);
      this.chatService.getUserConversation().subscribe((response: any) => {
        console.log(this.userConversations);
        console.log(response);
        console.log(response.conversations.length);
        console.log(this.oneToOneConversations);
        const index = response.conversations.length;
        const lastConver = response.conversations[index - 1];
        console.log(lastConver);
        this.oneToOneConversations.push(lastConver);
        console.log(this.userConversations);
        this.selectedMessage = lastConver;
      });
    });

    this.cd.detectChanges();
  }
// tslint:disable-next-line - Disables all
onSelect(message: any): void {

  console.log(message)
  this.messagesIds = []
  this.scrollToBottom();
  this.selectedMessage = message;
  console.log(this.selectedMessage);
  const conversationId = message.id;
  const socketId = this.socket.id;
  console.log(socketId);
  console.log(conversationId);

  message.messages.forEach((e:any)=>{
    this.messagesIds.push(e.id)
  })
  console.log(this.messagesIds)
  this.chatService.viewedStatus(this.messagesIds).subscribe((res:any)=>{
    this.selectedMessage.messages.forEach((e:any)=>{
      e.viewed = true
    })
  })
  console.log(this.selectedMessage);
  this.chatService.joinConver(conversationId, socketId);
  // this.socket.emit('join-conversation', { conversationId, socketId });
}
  getUserImage(senderId: number): string {
    const user = this.selectedMessage.users.find(
      (user: any) => user.id === senderId
    );
    return user ? user.image : '';
  }

  search(text: Observable<string>) {
    this.existingUserIds.push(this.authService.getUser().id);
    this.loadingSearch = true;
    text
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          return this.chatService.searchAllUsers(searchTerm);
        })
      )
      .subscribe((response: any) => {
        console.log(response);

        this.searchedUsers = response.users;
        console.log(this.searchedUsers);
        this.loadingSearch = false;
        this.cd.detectChanges(); // Manually trigger change detection
        console.log(this.oneToOneConversations);

        this.oneToOneConversations.forEach((e: any) => {
          if (!this.existingUserIds.includes(e.users[0].id))
            this.existingUserIds.push(e.users[0].id);
        });
        console.log(this.existingUserIds);
        this.filteredResponse = this.searchedUsers.filter(
          (user: any) => !this.existingUserIds.includes(user.id)
        );
        console.log(this.filteredResponse);
      });
    return new Observable();
  }

  checkUserAvailabe() {
    if (this.searchTerms == '' && this.userConversations)
      return this.userConversations.length > 0;
    if (!this.loadingSearch && this.searchedUsers)
      return this.searchedUsers.length > 0;
  }

  onTyping(): void {
    const conversationId = this.selectedMessage.id;
    // console.log(conversationId);
    // console.log(this.selectedMessage);
    // console.log(this.oneToOneConversations);
    // console.log(this.userConversations);
    this.chatService.userTyping(
      conversationId,
      true,
      this.authService.getUser().id
    );
  }

  onNotTyping(): void {
    const conversationId = this.selectedMessage.id;
    this.chatService.userTyping(
      conversationId,
      false,
      this.authService.getUser().id
    );
  }
  truncateMessageContent( messageContent: string, isCurrentUser: boolean): string {
    const maxChars = 10; // Maximum number of characters to display

    if (messageContent && messageContent.length > maxChars) {
      // Truncate the message content if it exceeds the maximum characters
      messageContent = messageContent.substring(0, maxChars) + '...';
    }

    if (isCurrentUser) {
      messageContent = 'You: ' + messageContent;
    }

    return messageContent;
  }
  isCurrentUser(message: any): boolean {
    const lastMessage = message.messages[message.messages.length - 1];
    return (
      lastMessage && lastMessage.senderId === this.authService.getUser().id
    );
  }
  getMessageContent(message: any) {
    if (message.messages.length > 0) {
      const filteredList = message.messages.filter(
        (element: any) => element !== this.authService.getUser().id
      );
      const lastElement = filteredList[filteredList.length - 1].message_body;

      return lastElement;
    }
  }
  toggleFontWeight(): void {
    // Toggle the font weight
    this.isBold = !this.isBold;

    // Always reset font weight immediately after a click
    setTimeout(() => {
      this.isBold = false;
    }, 0);
  }
  isViewed(message:any){
    this.lastMessage = ''
    if (message.messages.length > 0) {
      const filteredList = message.messages.filter(
        (element: any) => element !== this.authService.getUser().id
      );
      this.lastMessage = filteredList[filteredList.length - 1]
      }

    if(this.lastMessage.viewed){
      return true
    }else{
      return false
    }

  }

  getImageSrc(): string {
    if (this.selectedMessage && this.selectedMessage.conversation_name == null) {
      // If conversation_name is not null or undefined, use the user's image
      return this.selectedMessage.users[0]?.image;
    } else {
      // If conversation_name is null or undefined, use the default image
      return 'assets/images/20945101.png';
    }
  }
}

