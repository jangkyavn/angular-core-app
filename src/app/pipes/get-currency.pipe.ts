import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCurrency'
})
export class GetCurrencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }
}
