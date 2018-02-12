import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService } from '../../../../services';

import { Function } from '../../../../models/function.model';
import { Permission } from '../../../../models/permission.model';

@Component({
  selector: 'role-modal-permission',
  templateUrl: './role-modal-permission.component.html',
  styleUrls: ['./role-modal-permission.component.scss']
})
export class RoleModalPermissionComponent implements OnInit {
  @ViewChild('roleModalPermission') roleModalPermission: ModalDirective;
  @Output() saveChangesPermissionResult = new EventEmitter<boolean>(false);

  functionHierarchies: Function[];
  roleId: string;

  selectedAllRead: boolean;
  selectedAllCreate: boolean;
  selectedAllUpdate: boolean;
  selectedAllDelete: boolean;

  nothingSelectedRead: boolean;
  nothingSelectedCreate: boolean;
  nothingSelectedUpdate: boolean;
  nothingSelectedDelete: boolean;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

  }

  resetCheckbox() {
    this.selectedAllRead = false;
    this.selectedAllCreate = false;
    this.selectedAllUpdate = false;
    this.selectedAllDelete = false;

    this.nothingSelectedRead = true;
    this.nothingSelectedCreate = true;
    this.nothingSelectedUpdate = true;
    this.nothingSelectedDelete = true;

    $('#chkAllRead').prop('indeterminate', false);
    $('#chkAllCreate').prop('indeterminate', false);
    $('#chkAllUpdate').prop('indeterminate', false);
    $('#chkAllDelete').prop('indeterminate', false);
  }

  loadFunctionList(roleId: string) {
    this.dataService.get('/api/Function/GetAllHierachy').subscribe(data => {
      this.functionHierarchies = data;

      this.fillPermission(roleId);
    });
  }

  fillPermission(roleId: string) {
    this.dataService.get(`/api/Role/ListAllFunction?roleId=${roleId}`).subscribe((data: Permission[]) => {
      const functionsLength = this.functionHierarchies.length;
      const permissionsLength = data.length;
      const functions = this.functionHierarchies;

      for (let i = 0; i < functionsLength; i++) {
        for (let j = 0; j < permissionsLength; j++) {
          if (functions[i].Id === data[j].FunctionId) {
            this.functionHierarchies[i].SelectedRead = data[j].CanRead;
            this.functionHierarchies[i].SelectedCreate = data[j].CanCreate;
            this.functionHierarchies[i].SelectedUpdate = data[j].CanUpdate;
            this.functionHierarchies[i].SelectedDelete = data[j].CanDelete;
          }
        }
      }

      for (let i = 0; i < functionsLength; i++) {
        if (functions[i].ParentId === null) {
          const functionsByParent = functions.filter((item: Function) => {
            return item.ParentId === functions[i].Id;
          });

          //----------------------------- Selected all child read -----------------------------
          const selectedAllChildRead = functionsByParent.every((item: Function) => {
            return item.SelectedRead;
          });

          const nothingSelectedChildRead = functionsByParent.every((item: Function) => {
            return !item.SelectedRead;
          });

          if (!selectedAllChildRead && !nothingSelectedChildRead) {
            $(`#chkRead${functions[i].Id}`).prop('indeterminate', true);
          } else {
            $(`#chkRead${functions[i].Id}`).prop('indeterminate', false);
          }

          //----------------------------- Selected all child create -----------------------------
          const selectedAllChildCreate = functionsByParent.every((item: Function) => {
            return item.SelectedCreate;
          });

          const nothingSelectedChildCreate = functionsByParent.every((item: Function) => {
            return !item.SelectedCreate;
          });

          if (!selectedAllChildCreate && !nothingSelectedChildCreate) {
            $(`#chkCreate${functions[i].Id}`).prop('indeterminate', true);
          } else {
            $(`#chkCreate${functions[i].Id}`).prop('indeterminate', false);
          }

          //----------------------------- Selected all child update -----------------------------
          const selectedAllChildUpdate = functionsByParent.every((item: Function) => {
            return item.SelectedUpdate;
          });

          const nothingSelectedChildUpdate = functionsByParent.every((item: Function) => {
            return !item.SelectedUpdate;
          });

          if (!selectedAllChildUpdate && !nothingSelectedChildUpdate) {
            $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', true);
          } else {
            $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', false);
          }

          //----------------------------- Selected all child delete -----------------------------
          const selectedAllChildDelete = functionsByParent.every((item: Function) => {
            return item.SelectedDelete;
          });

          const nothingSelectedChildDelete = functionsByParent.every((item: Function) => {
            return !item.SelectedDelete;
          });

          if (!selectedAllChildDelete && !nothingSelectedChildDelete) {
            $(`#chkDelete${functions[i].Id}`).prop('indeterminate', true);
          } else {
            $(`#chkDelete${functions[i].Id}`).prop('indeterminate', false);
          }
        }
      }

      //----------------------------- Selected all read -----------------------------
      this.selectedAllRead = functions.every((item: Function) => {
        return item.SelectedRead;
      });

      this.nothingSelectedRead = functions.every((item: Function) => {
        return !item.SelectedRead;
      });

      if (!this.selectedAllRead && !this.nothingSelectedRead) {
        $('#chkAllRead').prop('indeterminate', true);
      } else {
        $('#chkAllRead').prop('indeterminate', false);
      }

      //----------------------------- Selected all create -----------------------------
      this.selectedAllCreate = functions.every((item: Function) => {
        return item.SelectedCreate;
      });

      this.nothingSelectedCreate = functions.every((item: Function) => {
        return !item.SelectedCreate;
      });

      if (!this.selectedAllCreate && !this.nothingSelectedCreate) {
        $('#chkAllCreate').prop('indeterminate', true);
      } else {
        $('#chkAllCreate').prop('indeterminate', false);
      }

      //----------------------------- Selected all update -----------------------------
      this.selectedAllUpdate = functions.every((item: Function) => {
        return item.SelectedUpdate;
      });

      this.nothingSelectedUpdate = functions.every((item: Function) => {
        return !item.SelectedUpdate;
      });

      if (!this.selectedAllUpdate && !this.nothingSelectedUpdate) {
        $('#chkAllUpdate').prop('indeterminate', true);
      } else {
        $('#chkAllUpdate').prop('indeterminate', false);
      }

      //----------------------------- Selected all delete -----------------------------
      this.selectedAllDelete = functions.every((item: Function) => {
        return item.SelectedDelete;
      });

      this.nothingSelectedDelete = functions.every((item: Function) => {
        return !item.SelectedDelete;
      });

      if (!this.selectedAllDelete && !this.nothingSelectedDelete) {
        $('#chkAllDelete').prop('indeterminate', true);
      } else {
        $('#chkAllDelete').prop('indeterminate', false);
      }
    });
  }

  saveChanges() {
    let listPermmission: Permission[] = [];

    for (let item of this.functionHierarchies) {
      listPermmission.push({
        RoleId: this.roleId,
        FunctionId: item.Id,
        CanRead: item.SelectedRead,
        CanCreate: item.SelectedCreate,
        CanUpdate: item.SelectedUpdate,
        CanDelete: item.SelectedDelete
      });
    }

    const data = {
      listPermmission,
      roleId: this.roleId
    };

    this.dataService.post('/api/Role/SavePermission', data).subscribe((response: any) => {
      if (response !== null && response !== undefined) {
        this.saveChangesPermissionResult.emit(true);
      } else {
        this.saveChangesPermissionResult.emit(false);
      }
    });
  }

  showModal(roleId: string) {
    this.roleId = roleId;
    this.resetCheckbox();
    this.loadFunctionList(roleId);

    this.roleModalPermission.show();
  }

  hideModal() {
    this.roleModalPermission.hide();
  }

  selecteAll(type: string) {
    const functionsLength = this.functionHierarchies.length;

    if (type === 'READ') {
      for (var i = 0; i < functionsLength; i++) {
        this.functionHierarchies[i].SelectedRead = this.selectedAllRead;
        $(`#chkRead${this.functionHierarchies[i].Id}`).prop('indeterminate', false);
      }

      this.nothingSelectedRead = true;
    } else if (type === 'CREATE') {
      for (var i = 0; i < functionsLength; i++) {
        this.functionHierarchies[i].SelectedCreate = this.selectedAllCreate;
        $(`#chkCreate${this.functionHierarchies[i].Id}`).prop('indeterminate', false);
      }

      this.nothingSelectedCreate = true;
    } else if (type === 'UPDATE') {
      for (var i = 0; i < functionsLength; i++) {
        this.functionHierarchies[i].SelectedUpdate = this.selectedAllUpdate;
        $(`#chkUpdate${this.functionHierarchies[i].Id}`).prop('indeterminate', false);
      }

      this.nothingSelectedUpdate = true;
    } else {
      for (var i = 0; i < functionsLength; i++) {
        this.functionHierarchies[i].SelectedDelete = this.selectedAllDelete;
        $(`#chkDelete${this.functionHierarchies[i].Id}`).prop('indeterminate', false);
      }

      this.nothingSelectedDelete = true;
    }
  }

  checkIfAllSelected(type: string, id: string) {
    const functions = this.functionHierarchies;
    const functionsLength = this.functionHierarchies.length;
    const functionById = functions.find(x => x.Id == id);

    if (type === 'READ') {
      if (functionById.ParentId === null) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedRead = functionById.SelectedRead;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildRead = functionsByParent.every((item: Function) => {
              return item.SelectedRead;
            });

            const nothingSelectedChildRead = functionsByParent.every((item: Function) => {
              return !item.SelectedRead;
            });

            if (!selectedAllChildRead && !nothingSelectedChildRead) {
              $(`#chkRead${functions[i].Id}`).prop('indeterminate', true);
              this.functionHierarchies[i].SelectedRead = true;
            } else if (selectedAllChildRead && !nothingSelectedChildRead) {
              $(`#chkRead${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedRead = true;
            } else if (!selectedAllChildRead && nothingSelectedChildRead) {
              $(`#chkRead${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedRead = false;
            }

            break;
          }
        }
      }

      this.selectedAllRead = functions.every((item: Function) => {
        return item.SelectedRead == true;
      });

      this.nothingSelectedRead = functions.every((item: Function) => {
        return item.SelectedRead == false;
      });

      if (!this.selectedAllRead && !this.nothingSelectedRead) {
        $('#chkAllRead').prop('indeterminate', true);
      } else {
        $('#chkAllRead').prop('indeterminate', false);
      }
    } else if (type === 'CREATE') {
      if (functionById.ParentId === null) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedCreate = functionById.SelectedCreate;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildCreate = functionsByParent.every((item: Function) => {
              return item.SelectedCreate;
            });

            const nothingSelectedChildCreate = functionsByParent.every((item: Function) => {
              return !item.SelectedCreate;
            });

            if (!selectedAllChildCreate && !nothingSelectedChildCreate) {
              $(`#chkCreate${functions[i].Id}`).prop('indeterminate', true);
              this.functionHierarchies[i].SelectedCreate = true;
            } else if (selectedAllChildCreate && !nothingSelectedChildCreate) {
              $(`#chkCreate${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedCreate = true;
            } else if (!selectedAllChildCreate && nothingSelectedChildCreate) {
              $(`#chkCreate${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedCreate = false;
            }

            break;
          }
        }
      }

      this.selectedAllCreate = functions.every((item: Function) => {
        return item.SelectedCreate == true;
      });

      this.nothingSelectedCreate = functions.every((item: Function) => {
        return item.SelectedCreate == false;
      });

      if (!this.selectedAllCreate && !this.nothingSelectedCreate) {
        $('#chkAllCreate').prop('indeterminate', true);
      } else {
        $('#chkAllCreate').prop('indeterminate', false);
      }
    } else if (type === 'UPDATE') {
      if (functionById.ParentId === null) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedUpdate = functionById.SelectedUpdate;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildUpdate = functionsByParent.every((item: Function) => {
              return item.SelectedUpdate;
            });

            const nothingSelectedChildUpdate = functionsByParent.every((item: Function) => {
              return !item.SelectedUpdate;
            });

            if (!selectedAllChildUpdate && !nothingSelectedChildUpdate) {
              $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', true);
              this.functionHierarchies[i].SelectedUpdate = true;
            } else if (selectedAllChildUpdate && !nothingSelectedChildUpdate) {
              $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedUpdate = true;
            } else if (!selectedAllChildUpdate && nothingSelectedChildUpdate) {
              $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedUpdate = false;
            }

            break;
          }
        }
      }

      this.selectedAllUpdate = functions.every((item: Function) => {
        return item.SelectedUpdate == true;
      });

      this.nothingSelectedUpdate = functions.every((item: Function) => {
        return item.SelectedUpdate == false;
      });

      if (!this.selectedAllUpdate && !this.nothingSelectedUpdate) {
        $('#chkAllUpdate').prop('indeterminate', true);
      } else {
        $('#chkAllUpdate').prop('indeterminate', false);
      }
    } else if (type === 'DELETE') {
      if (functionById.ParentId === null) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedDelete = functionById.SelectedDelete;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildDelete = functionsByParent.every((item: Function) => {
              return item.SelectedDelete;
            });

            const nothingSelectedChildDelete = functionsByParent.every((item: Function) => {
              return !item.SelectedDelete;
            });

            if (!selectedAllChildDelete && !nothingSelectedChildDelete) {
              $(`#chkDelete${functions[i].Id}`).prop('indeterminate', true);
              this.functionHierarchies[i].SelectedDelete = true;
            } else if (selectedAllChildDelete && !nothingSelectedChildDelete) {
              $(`#chkDelete${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedDelete = true;
            } else if (!selectedAllChildDelete && nothingSelectedChildDelete) {
              $(`#chkDelete${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedDelete = false;
            }

            break;
          }
        }
      }

      this.selectedAllDelete = functions.every((item: Function) => {
        return item.SelectedDelete == true;
      });

      this.nothingSelectedDelete = functions.every((item: Function) => {
        return item.SelectedDelete == false;
      });

      if (!this.selectedAllDelete && !this.nothingSelectedDelete) {
        $('#chkAllDelete').prop('indeterminate', true);
      } else {
        $('#chkAllDelete').prop('indeterminate', false);
      }
    }
  }
}