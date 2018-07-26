import { Tenant } from './../../models/tenants';
import { Building } from './../../models/buildings';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreDataService } from './../../firestore-data.service';
import { Group } from './../../models/group';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss']
})
export class ListGroupComponent implements OnInit {
  groupList: Group[];
  buildingList: Building[];
  tenantList: Tenant[];
  isGroupListEmpty: boolean;
  isTenantListEmpty: boolean;
  isBuidlingListEmpty: boolean;
  isUpdate: boolean;
  ngModelRef: any;
  selectedBuilding: string;
  selectedGroup: string;
  selectedTenant: string;
  group: Group;
  building: Building;
  tenant: Tenant;
  buildingId: any;
  groupId: any;
  tenantId: any;
  selectedBuildingDeleted: any;
  selectedTenantDeleted: any;
  selectedGroupDeleted: any;
  selectedTenantStatus: any;
  constructor(private _firestoreDataService: FirestoreDataService, private modalService: NgbModal,
     private router: Router) { }

    ngOnInit() {
      this.selectedBuildingDeleted = 'N';
      this.selectedTenantDeleted = 'N';
      this.selectedGroupDeleted = 'N';
      this.selectedTenantStatus = 'Active';
      this.selectedGroup = 'lYDZRANkMlDMwYUb1DAe';
      this.isBuidlingListEmpty = false;
      this.isGroupListEmpty = false;
      this.isTenantListEmpty = false;
      this.group = new Group();
      this.building = new Building();
      this.tenant = new Tenant();
      this.groupList = [];
      this.isUpdate = false;
      this._firestoreDataService.getAllGroupList().subscribe( data => {
        this.groupList = data;
        if (this.groupList.length !== 0) {
          this.isGroupListEmpty = false;
          this.selectedGroup = this.groupList[0].id;
          console.log('group', this.groupList);
          this.groupList.forEach( group => {
            group.groupCreateDate = new Date(Number(group.groupCreateDate)).toLocaleString();
            group.groupUpdateDate = new Date(Number(group.groupUpdateDate)).toLocaleString();
          });
          this.getAllBuildingList();
        } else {
          this.isGroupListEmpty = true;
          this.buildingList = [];
        }
      });
    }

    getAllBuildingList() {
      this.buildingList = [];
      this.tenantList = [];
      this._firestoreDataService.getAllBuildingList(this.selectedGroup).subscribe( data => {
        console.log('building', data);
        this.buildingList = data;
        if (this.buildingList.length !== 0) {
          this.isBuidlingListEmpty = false;
          this.selectedBuilding = this.buildingList[0].id;
          this.buildingList.forEach( building => {
            if (building.buildingUpdateDate) {
              building.buildingUpdateDate = new Date(Number(building.buildingUpdateDate)).toLocaleString();
            }
            building.buildingCreateDate = new Date(Number(building.buildingCreateDate)).toLocaleString();
          });
          this.getAllTenantList();
        } else {
          this.isBuidlingListEmpty = true;
        }
      });
    }

    getAllTenantList() {
      this.tenantList = [];
      this._firestoreDataService.getAllTenantList(this.selectedGroup, this.selectedBuilding).subscribe( data => {
        this.tenantList = data;
        console.log(this.tenantList);
        if (this.tenantList.length !== 0) {
          this.isTenantListEmpty = false;
          this.selectedTenant = this.tenantList[0].id;
          this.tenantList.forEach( tenant => {
            tenant.tenantCreateDate = new Date(Number(tenant.tenantCreateDate)).toLocaleString();
            if (tenant.tenantUpdateDate) {
              tenant.tenantUpdateDate = new Date(Number(tenant.tenantUpdateDate)).toLocaleString();
            }
          });
        } else {
          this.isTenantListEmpty = true;
        }
      });
    }

    removeGroup(groupDetails) {
      if (confirm('Are you sure to remove group')) {
        this._firestoreDataService.removeGroup(groupDetails.id);
      }
    }

    openModal(content) {
      this.building = new Building();
      this.group = new Group();
      this.tenant = new Tenant();
      this.isUpdate = false;
      this.ngModelRef = this.modalService.open(content, { centered: true });
    }

    closeModal() {
      this.ngModelRef.close();
      this.isUpdate = false;
      this.group = null;
      this.building = null;
      this.tenant = null;
    }

    editGroup(groupDetails, content) {
      this.groupId = groupDetails.id;
      this.group = groupDetails;
      this.group.groupUpdateDate = new Date().getTime().toString();
      this.ngModelRef = this.modalService.open(content, { centered: true});
      this.isUpdate = true;
    }

    updateGroup() {
      this.group.groupUpdateDate = new Date().getTime().toString();
      this.group.groupUpdateBy = localStorage.getItem('username');
      this.group.groupCreateDate = Date.parse(this.group.groupCreateDate).toString();
      this.group.groupIsDeleted = this.selectedGroupDeleted === 'Y' ? true : false;
      this._firestoreDataService.updateGroup(this.group, this.groupId);
      this.ngModelRef.close();
      this.group = null;
      this.groupId = null;
      this.isUpdate = false;
    }

    addNewGroup() {
      this.group.groupCreateDate = new Date().getTime().toString();
      this.group.groupCreateBy = localStorage.getItem('username');
      this.group.groupId = 'lYDZRANkMlDMwYUb1DAe';
      this.group.groupIsDeleted = false;
      this._firestoreDataService.addNewGroup(this.group);
      this.ngModelRef.close();
      this.group = null;
    }

    addNewTenant() {
      this.tenant.tenantCreateDate = new Date().getTime().toString();
      this.tenant.tenantIsDeleted = this.selectedTenantDeleted === 'Y' ? true : false;
      this.tenant.tenantStatus = this.selectedTenantStatus;
      this.tenant.tenantCreateBy = localStorage.getItem('username');
      console.log(this.tenant);
      this._firestoreDataService.addNewTenant(this.selectedGroup, this.selectedBuilding, this.tenant);
      this.ngModelRef.close();
      this.tenant = null;
    }

    updateTenant() {
      this.tenant.tenantCreateDate = Date.parse(this.tenant.tenantCreateDate).toString();
      this.tenant.tenantUpdateDate = new Date().getTime().toString();
      this.tenant.tenantUpdateBy = localStorage.getItem('username');
      this.tenant.tenantIsDeleted = this.selectedTenantDeleted === 'Y' ? true : false;
      console.log(this.tenant);
      this._firestoreDataService.updateTenant(this.selectedGroup, this.selectedBuilding, this.tenant, this.tenantId);
      this.ngModelRef.close();
      this.tenant = null;
      this.tenantId = null;
      this.isUpdate = false;
    }

    editBuilding(buildingDetails, content) {
      this.buildingId = buildingDetails.id;
      console.log(this.selectedBuilding, buildingDetails);
      this.building = buildingDetails;
      this.selectedBuildingDeleted = this.building.buildingIsDeleted ? 'Y' : 'N';
      this.building.buildingLocation = [{
        latitude: 19.178342,
        longitude: 72.958132
      }];
      this.building.buildingCreateDate = buildingDetails.buildingCreateDate;
      this.building.buildingUpdateBy = localStorage.getItem('username');
      this.ngModelRef = this.modalService.open(content, { centered: true});
      this.isUpdate = true;
    }

    updateBuilding() {
      this.building.buildingUpdateDate = new Date().getTime().toString();
      this.building.buildingCreateDate = Date.parse(this.building.buildingCreateDate).toString();
      this.building.buildingIsDeleted = this.selectedBuildingDeleted === 'Y' ? true : false;
      console.log(this.building);
      this._firestoreDataService.updateBuilding(this.selectedGroup, this.building, this.buildingId);
      this.ngModelRef.close();
      this.building = null;
      this.buildingId = null;
      this.isUpdate = false;
    }

    addNewBuilding() {
      this.building.buildingCreateDate = new Date().getTime().toString();
      this.building.buildingCreateBy = localStorage.getItem('username');
      this.building.buildingLocation = [{
        latitude: 19.178342,
        longitude: 72.958132
      }];
      this._firestoreDataService.addNewBuilding(this.selectedGroup, this.building);
      this.ngModelRef.close();
    }

    removeBuilding(buildingDetails) {
      console.log(buildingDetails);
      if (confirm('Are you sure to remove building')) {
        this._firestoreDataService.removeBuilding(this.selectedGroup, this.selectedBuilding, buildingDetails.id);
      }
    }

    editTenant(tenantDetails, content) {
      console.log(tenantDetails);
      this.tenant = tenantDetails;
      this.tenantId = tenantDetails.id;
      this.ngModelRef = this.modalService.open(content, { centered: true});
      this.isUpdate = true;
    }

    removeTenant(tenantDetails) {
      if (confirm('Are you sure to remove tenant')) {
        this._firestoreDataService.removeTenant(this.selectedGroup, this.selectedBuilding, tenantDetails.id);
      }
    }
}
