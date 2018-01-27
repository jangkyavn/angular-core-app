import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UrlConstants } from '../common/url.constants';

@Injectable()
export class UtilityService {

  constructor(private router: Router) { }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  navigateToLogin() {
    this.router.navigate([UrlConstants.LOGIN]);
  }

  dateFormatJson(datetime: any) {
    if (datetime === null || datetime === '') {
      return '';
    }

    const newDate = new Date(datetime);

    let sMonth = '', sDay = '';

    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let year = newDate.getFullYear();

    if (month < 10)
      sMonth = "0" + month;
    if (day < 10)
      sDay = "0" + day;

    return sDay + "/" + sMonth + "/" + year;
  }

  dateTimeFormatJson(datetime: any) {
    if (datetime === null || datetime === '')
      return '';

    let sDay = '', sMonth = '', sHH = '', sMM = '', sSS = '';

    let newDate = new Date(datetime);
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let year = newDate.getFullYear();
    let hh = newDate.getHours();
    let mm = newDate.getMinutes();
    let ss = newDate.getSeconds();

    if (month < 10)
      sMonth = "0" + month;
    if (day < 10)
      sDay = "0" + day;
    if (hh < 10)
      sHH = "0" + hh;
    if (mm < 10)
      sMM = "0" + mm;
    if (ss < 10)
      sSS = "0" + ss;

    return sDay + "/" + sMonth + "/" + year + " " + sHH + ":" + sMM + ":" + sSS;
  }

  formatNumber(number: number, precision: number) {
    if (!isFinite(number)) {
      return number.toString();
    }

    let a = number.toFixed(precision).split('.');
    a[0] = a[0].replace(/\d(?=(\d{3})+$)/g, '$&,');
    return a.join('.');
  }

  unflatten(arr: any[]): any[] {
    let map = {};
    let roots: any[] = [];

    for (let i = 0; i < arr.length; i++) {
      let node = arr[i];
      node.children = [];
      map[node.Id] = i; // use map to look-up the parents

      if (node.ParentId !== null) {
        arr[map[node.ParentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  fuzzySearch (needle: string, haystack: string) {
    const haystackLC = haystack.toLowerCase();
    const needleLC = needle.toLowerCase();
  
    const hlen = haystack.length;
    const nlen = needleLC.length;
  
    if(needleLC.charAt(0) === needleLC.charAt(1) && haystackLC.indexOf(needleLC) === -1) {
      return false;
    }
    if (nlen > hlen) {
      return false;
    }
    if (nlen === hlen) {
      return needleLC === haystackLC;
    }
    outer: for (let i = 0, j = 0; i < nlen; i++) {
      const nch = needleLC.charCodeAt(i);
  
      while (j < hlen) {
        if (haystackLC.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  makeSeoAlias(input: any) {
    if (input == undefined || input == '')
      return '';
    //Đổi chữ hoa thành chữ thường
    var slug = input.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
  }
}
