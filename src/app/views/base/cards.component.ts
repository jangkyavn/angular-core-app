import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

import { DataService } from '../../services/data.service';
import { SystemConstants } from 'app/common/system.constants';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'cards.component.html',
  styles: [`
    
  `]
})
export class CardsComponent implements OnInit {
  roles$: Observable<any[]>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.roles$ = this.dataService.get('/api/Role/getall');
  }
}
