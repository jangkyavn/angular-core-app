import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, UploadService } from '../../../../services';
import { ProductCategory } from '../../../../models/product-category.model';
import { SystemConstants } from '../../../../common/system.constants';

@Component({
  selector: 'product-modal-import-excel',
  templateUrl: './product-modal-import-excel.component.html',
  styleUrls: ['./product-modal-import-excel.component.scss']
})
export class ProductModalImportExcelComponent implements OnInit {
  @Output() saveChangesResult = new EventEmitter<boolean>(false);
  @ViewChild('productModalImportExcel') public productModalImportExcel: ModalDirective

  importExcelForm: FormGroup;
  productCategoryHierachies: ProductCategory[];
  files: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dataService: DataService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.createForm();
    this.loadProductCategoryHierachies();
  }

  loadProductCategoryHierachies() {
    this.dataService.get('/api/ProductCategory/GetAllHierachy').subscribe(data => {
      this.productCategoryHierachies = data;
    });
  }

  createForm() {
    this.importExcelForm = this.fb.group({
      files: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  saveChanges() {
    let fileUpload: any = $("#fileInput").get(0);
    let files = fileUpload.files;

    let fileData = new FormData();
    for (let i = 0; i < files.length; i++) {
      fileData.append("files", files[i]);
    }
    fileData.append('categoryId', this.importExcelForm.value.categoryId);

    this.dataService.postFile(`/api/Product/ImportExcel`, fileData).subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.saveChangesResult.emit(true);
      } else {
        this.saveChangesResult.emit(false);
      }
    });
  }

  showModal() {
    this.importExcelForm.reset({
      files: '',
      categoryId: ''
    });
    $('#fileInput').val(null);

    this.productModalImportExcel.show();
  }

  hideModal() {
    this.productModalImportExcel.hide();
  }

  btnSelectFile() {
    $('#fileInput').click();
  }

  changeFileInput(event: any) {
    let files: any;
    this.files = event.target.files;

    if (event.target.files[0] != undefined && event.target.files[0] != null) {
      files = event.target.files[0].name;
    } else {
      files = '';
    }

    this.importExcelForm.patchValue({
      files
    })
  }
}
