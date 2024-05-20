// import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
// import { ExtraService } from '../../services/extra.service';
//
// @Directive({
//   selector: '[checkPhoneFormat]'
// })
// export class CheckPhoneFormatDirective {
//
//   @Input() phoneNumber: string;
//   @Input() countryCode: string;
//   @Input() callingCode: string;
//
//   @Output() isPending = new EventEmitter();
//   @Output() valid = new EventEmitter();
//
//   constructor(private extraService: ExtraService) { }
//
//   @HostListener('change') onChange() {
//
//     if (this.phoneNumber !== '' && this.countryCode !== '' && this.callingCode !== '') {
//
//       this.isPending.emit('true');
//
//       this.extraService.getCollection('check-phonenumber-format-by-country/'
//         + this.callingCode + '/' + this.phoneNumber + '/' + this.countryCode).subscribe((response: any) => {
//
//           if (response.isValid) {
//             this.valid.emit('true');
//           } else {
//             this.valid.emit('false');
//
//           }
//           this.isPending.emit('false');
//         });
//     }
//     // else {
//     //   this.valid.emit('false');
//     // }
//
//   }
//
// }
