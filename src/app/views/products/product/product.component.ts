import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService } from '../../../services';
import { SystemConstants, MessageConstants } from '../../../common';
import { PagedResult } from 'app/models/paged-result.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  modalTitle: string = '';

  products: any[];
  productCategoryHierachies: any[];
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 5;
  lengthMenu: number = 10;
  pageCount: number;
  totalRow: number;
  filterKeyword: string = '';
  filterCategoryId: any;
  selectedAll: any;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadData();
    this.loadProductCategoryHierachies();
  }

  loadData() {
    const url = `/api/Product/GetAllPaging?keyword=${this.filterKeyword}&categoryId=${this.filterCategoryId}&page=${this.pageIndex}&pageSize=${this.pageSize}`;

    this.dataService.get(url).subscribe((response: any) => {
      const data: PagedResult = response;

      this.products = data.Results;
      this.pageIndex = data.CurrentPage;
      this.pageSize = data.PageSize;
      this.totalRow = data.RowCount;
      this.pageCount = data.PageCount;
    });
  }

  private loadProductCategoryHierachies() {
    this.dataService.get('/api/ProductCategory/GetAllHierachy').subscribe(data => {
      this.productCategoryHierachies = data;
    });
  }

  changeStatus(id: number) {
    console.log(id);
  }

  search(value: string) {
    this.filterKeyword = value;

    this.loadData();
  }

  searchDropDown(value: string) {
    this.filterCategoryId = value;

    this.loadData();
  }
  
  onChange(value: number) {
    this.pageSize = value;

    this.loadData();
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;

    this.loadData();
  }

  selectAll() {
    this.pageSize = -1;
    this.loadData();
    
    for (var i = 0; i < this.products.length; i++) {
      this.products[i].Selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.products.every(function(item:any) {
      return item.Selected == true;
    })

    if (this.selectedAll === true) {
      this.pageSize = -1;
      this.loadData();
    }
  }
}
