import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {

  constructor() { }

  parseTokenBase(result: any) {
    const base64Url = result.token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const user = JSON.parse(window.atob(base64));

    return user;
  }
}
