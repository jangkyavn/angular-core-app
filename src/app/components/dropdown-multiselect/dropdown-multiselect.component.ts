import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

interface RoleSelect {
  Id?: string;
  Name?: string;
  Selected?: boolean;
}

@Component({
  selector: 'dropdown-multiselect',
  templateUrl: './dropdown-multiselect.component.html',
  styleUrls: ['./dropdown-multiselect.component.scss']
})
export class DropdownMultiselectComponent implements OnInit, OnChanges {
  @Input() dmData: RoleSelect[];
  @Input() dmButtonName: string;
  @Output() selectedItem = new EventEmitter<string[]>();

  buttonName: string = 'Chọn quyền';
  roles: RoleSelect[];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.roles = this.dmData;

    this.buttonName = this.dmButtonName;
  }

  checkdRole(item: any) {
    let data = this.roles;

    const rolesLength = data.length;
    for (let i = 0; i < rolesLength; i++) {
      if (data[i].Id === item.Id) {
        data[i].Selected = !item.Selected;
      }
    }

    let rolesSelected = data.filter(x => x.Selected === true);

    let namesSelected = rolesSelected.map(x => x.Name);
    this.buttonName = namesSelected.join(', ') == '' ? 'Chọn quyền' : namesSelected.join(', ');

    if (namesSelected.length === rolesLength) {
      this.buttonName = 'Tất cả';
    }

    this.selectedItem.emit(namesSelected);
  }
}
