// import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
// import { CoreUser } from '../../models/all';
// import { DataService } from '../../services/data.service';
//
// @Directive({
//   selector: '[verifyCurentPassword]'
// })
// export class VerifyCurentPasswordDirective {
//
//   @Input() itemURI: string;
//   @Input() checkBy: string;
//   @Input() user: number;
//   @Input() valueToCheck: string;
//   @Output() isPending = new EventEmitter();
//   @Output() valid = new EventEmitter();
//
//   constructor(private dataService: DataService) { }
//
//   @HostListener('change') onChange() {
//     if (this.valueToCheck !== '') {
//
//       if (this.checkBy === 'currentPassword') {
//         this.isPending.emit('true');
//         const option = this.checkBy + '/' + this.user + '/' + this.valueToCheck;
//
//         this.dataService.getCollection(this.getClassFromItemURI(this.itemURI), '/verify-' + option).subscribe(
//           (response) => {
//             const res = JSON.parse(JSON.stringify(response));
//             if (res.verify) {
//               this.valid.emit('true');
//             } else {
//               this.valid.emit('false');
//             }
//             this.isPending.emit('false');
//           });
//       }
//
//     }
//
//   }
//
//   // You have to update this method
//   getClassFromItemURI(itemURI: string) {
//     if (itemURI === 'core-users') {
//       return new CoreUser();
//     } else {
//       return 'undefined';
//     }
//
//   }
//
// }
