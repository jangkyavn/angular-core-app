import { Component, OnInit, OnChanges, Output, ViewChild, EventEmitter } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { DataService, NotificationService } from '../../../../services';

import { Function } from '../../../../models/function.model';
import { Permission } from '../../../../models/permission.model';

@Component({
  selector: 'role-modal-permission',
  templateUrl: './role-modal-permission.component.html',
  styleUrls: ['./role-modal-permission.component.scss']
})
export class RoleModalPermissionComponent implements OnInit, OnChanges {
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

  ngOnChanges() {

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

      for(let i  = 0; i < functionsLength; i++) {
        for (let j = 0; j < permissionsLength; j++) {
          if (functions[i].Id === data[j].FunctionId) {
            this.functionHierarchies[i].SelectedRead = data[j].CanRead;
            this.functionHierarchies[i].SelectedCreate = data[j].CanCreate;
            this.functionHierarchies[i].SelectedUpdate = data[j].CanUpdate;
            this.functionHierarchies[i].SelectedDelete = data[j].CanDelete;
          }
        }
      }

      for(let i = 0; i < functionsLength; i++) {
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

    for(let item of this.functionHierarchies) {
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

    this.dataService.post('/api/Role/SavePermission', data).subscribe(() => {
      this.saveChangesPermissionResult.emit(true);
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
      }
    } else if (type === 'CREATE') {
      for (var i = 0; i < functionsLength; i++) {
        this.functionHierarchies[i].SelectedCreate = this.selectedAllCreate;
      }
    } else if (type === 'UPDATE') {
      for (var i = 0; i < functionsLength; i++) {
        this.functionHierarchies[i].SelectedUpdate = this.selectedAllUpdate;
      }
    } else {
      for (var i = 0; i < functionsLength; i++) {
        this.functionHierarchies[i].SelectedDelete = this.selectedAllDelete;
      }
    }
  }

  checkIfAllSelected(type: string, id: string) {
    const functions = this.functionHierarchies;
    const functionsLength = this.functionHierarchies.length;
    const functionById = functions.find(x => x.Id == id);

    if (type === 'READ') {
      if (functionById.ParentId == null && functionById.SelectedRead) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedRead = true;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedRead = false;
          }
        }
      }

      if (functionById.ParentId !== null && functionById.SelectedRead) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildRead = functionsByParent.every((item: Function) => {
              return item.SelectedRead;
            });

            if (selectedAllChildRead) {
              $(`#chkRead${functions[i].Id}`).prop('indeterminate', false);
            } else {
              $(`#chkRead${functions[i].Id}`).prop('indeterminate', true);
            }

            this.functionHierarchies[i].SelectedRead = true;

            break;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const nothingSelectedChildRead = functionsByParent.every((item: Function) => {
              return !item.SelectedRead;
            });

            if (nothingSelectedChildRead) {
              $(`#chkRead${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedRead = false;
            } else {
              $(`#chkRead${functions[i].Id}`).prop('indeterminate', true);
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
      if (functionById.ParentId == null && functionById.SelectedCreate) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedCreate = true;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedCreate = false;
          }
        }
      }

      if (functionById.ParentId !== null && functionById.SelectedCreate) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildCreate = functionsByParent.every((item: Function) => {
              return item.SelectedCreate;
            });

            if (selectedAllChildCreate) {
              $(`#chkCreate${functions[i].Id}`).prop('indeterminate', false);
            } else {
              $(`#chkCreate${functions[i].Id}`).prop('indeterminate', true);
            }

            this.functionHierarchies[i].SelectedCreate = true;

            break;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const nothingSelectedChildCreate = functionsByParent.every((item: Function) => {
              return !item.SelectedCreate;
            });

            if (nothingSelectedChildCreate) {
              $(`#chkCreate${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedCreate = false;
            } else {
              $(`#chkCreate${functions[i].Id}`).prop('indeterminate', true);
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
      if (functionById.ParentId == null && functionById.SelectedUpdate) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedUpdate = true;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedUpdate = false;
          }
        }
      }

      if (functionById.ParentId !== null && functionById.SelectedUpdate) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildUpdate = functionsByParent.every((item: Function) => {
              return item.SelectedUpdate;
            });

            if (selectedAllChildUpdate) {
              $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', false);
            } else {
              $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', true);
            }

            this.functionHierarchies[i].SelectedUpdate = true;

            break;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const nothingSelectedChildUpdate = functionsByParent.every((item: Function) => {
              return !item.SelectedUpdate;
            });

            if (nothingSelectedChildUpdate) {
              $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedUpdate = false;
            } else {
              $(`#chkUpdate${functions[i].Id}`).prop('indeterminate', true);
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
    } else {
      if (functionById.ParentId == null && functionById.SelectedDelete) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedDelete = true;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].ParentId !== null && functions[i].ParentId === functionById.Id) {
            this.functionHierarchies[i].SelectedDelete = false;
          }
        }
      }

      if (functionById.ParentId !== null && functionById.SelectedDelete) {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const selectedAllChildDelete = functionsByParent.every((item: Function) => {
              return item.SelectedDelete;
            });

            if (selectedAllChildDelete) {
              $(`#chkDelete${functions[i].Id}`).prop('indeterminate', false);
            } else {
              $(`#chkDelete${functions[i].Id}`).prop('indeterminate', true);
            }

            this.functionHierarchies[i].SelectedDelete = true;

            break;
          }
        }
      } else {
        for (let i = 0; i < functionsLength; i++) {
          if (functions[i].Id === functionById.ParentId) {
            const functionsByParent = functions.filter((item: Function) => {
              return item.ParentId === functions[i].Id;
            });

            const nothingSelectedChildDelete = functionsByParent.every((item: Function) => {
              return !item.SelectedDelete;
            });

            if (nothingSelectedChildDelete) {
              $(`#chkDelete${functions[i].Id}`).prop('indeterminate', false);
              this.functionHierarchies[i].SelectedDelete = false;
            } else {
              $(`#chkDelete${functions[i].Id}`).prop('indeterminate', true);
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
