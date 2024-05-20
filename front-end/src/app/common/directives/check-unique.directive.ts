
import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import {UsersModel} from "../../models/users.model";

@Directive({
  selector: '[checkUnique]'
})
export class CheckUniqueDirective {

  @Input() itemURI: string;
  @Input() checkBy: string;
  @Input() valueToCheck: string;
  @Input() initialValue = '';
  @Input() entityName: string;
  @Output() isPending = new EventEmitter();
  @Output() valid = new EventEmitter();

  constructor(private dataService: DataService) { }

  @HostListener('change') onChange() {

    if (this.valueToCheck !== '' && this.valueToCheck.toUpperCase() !== this.initialValue.toUpperCase()) {
      const regExp = new RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
      const emailMatchWithRegExp = this.valueToCheck.match(regExp);

      // if valueToCheck is an email dont lunch request onley if email matches with pattern
      if (!(this.checkBy === 'email' && emailMatchWithRegExp == null)) {
        this.isPending.emit('true');
        let option = this.checkBy + '/' + this.valueToCheck;

        if (this.entityName !== undefined) {
          option = this.checkBy + '/' + this.valueToCheck + '/' + this.entityName;
        }

        this.dataService.getCollection(this.getClassFromItemURI(this.itemURI), null).subscribe(
          (response) => {
            const res = JSON.parse(JSON.stringify(response));
            if (res.isUnique) {
              this.valid.emit('true');
            } else {
              this.valid.emit('false');
            }
            this.isPending.emit('false');
          });
      }
    }

  }

  // You have to update this method
  getClassFromItemURI(itemURI: string) {
    if (itemURI === 'core-roles') {
      return new UsersModel();

    } else {
      return 'undefined';
    }

  }

}
