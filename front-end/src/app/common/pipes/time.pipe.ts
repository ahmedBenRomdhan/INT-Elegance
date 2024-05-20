import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'customTimePipe'
})
export class CustomTimePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return moment(value,'HH:mm').format("HH:mm A");
  }
}