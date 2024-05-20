import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {
  transform(value: string): string {
    const urlRegex = /((https?:\/\/)[^\s]+)/g;
    return value.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  }
}
