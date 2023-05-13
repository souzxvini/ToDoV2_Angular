import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltipList'
})
export class TooltipListPipe implements PipeTransform {

  transform(lines: string[]): string {

    let list: string = '';

    lines.forEach(line => {
      if(line == "Must have at least:"){
        list += line + '\n';
      } else{
        list += '• ' + line + '\n';
      }

    });
    return list;
  }

}
