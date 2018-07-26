import { Tenant } from './models/tenants';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Vehicle } from './models/vehicles';
import { Variant} from './models/variants';
import { Model } from './models/models';
import 'rxjs/add/operator/map';
import { Service } from './models/services';
import { SubService } from './models/subServices';
import { Building } from './models/buildings';
import { User } from './models/users';

@Injectable({
  providedIn: 'root'
})

export class FirestoreDataService implements OnInit {
  models: Observable<Model[]>;
  servicesList: Observable<Service[]>;
  subServicesList: Observable<SubService[]>;
  buildingList: Observable<Building[]>;
  tenantList: Observable<Tenant[]>;
  model: Model;
  users: any;
  private vehiclesTypesList: any;
  variants: Observable<Variant[]>;
  private allBrandsByVehicleType: any;
  constructor(private afs: AngularFirestore, private db: AngularFireDatabase,
  private _loadingBar: SlimLoadingBarService) {}

  ngOnInit() {
    this.users = [];
  }

  getAllServiceListWithoutFilter(selectedVehicleType): Observable<any> {
    this.servicesList = this.afs.collection('service_master', ref => ref.where('vehicle_type_id',
   '==', selectedVehicleType))
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Service;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.servicesList;
  }

  checkIsAdmin(email): Observable<any> {
    this.users = this.afs.collection('users', ref => ref.where('userEmail', '==', email))
    .snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Service;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.users;
  }

  registerUser(userId, userName, userRole, userEmail, userMobile, userIsDeleted, userCreateDate,
    userCreateBy): string {
    const result = 'error';
    this.afs.collection('users')
    .add({
        'userId': userId,
        'userName': userName,
        'userRole': userRole,
        'userEmail': userEmail,
        'userMobile': userMobile,
        'userIsDeleted': userIsDeleted,
        'userCreateDate': userCreateDate,
        'userCreateBy': userCreateBy
      })
    .then( docRef => {
      console.log('docRef', docRef.id);
      return 'success';
    }).catch( error => {
      console.log('error', error);
      return 'error';
    });
    return result;
  }

  storeUserNameInLocalStorageFromEmail(email): Observable<any> {
    console.log(email);
    this.users = this.afs.collection('users', ref => ref.where('userId', '==', email))
    .snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          console.log('data', data);
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.users;
  }

  getServicesList(selectedVehicleType): Observable<any> {
    this.servicesList = this.afs.collection('service_master', ref => ref.where('vehicle_type_id',
    '==', selectedVehicleType))
    .snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Service;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.servicesList;
  }

  addServicesToVariant(subServiceList, selectedVehicleType, selectedBrand, selectedModel, variantname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(selectedBrand).collection('model')
    .doc(selectedModel).collection('variant')
    .add({
        'services': subServiceList,
        'variantname': variantname
      })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateServiceToVariant(subServiceList, selectedVehicleType, selectedBrand, selectedModel, selectedVariant, variantname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(selectedBrand).collection('model')
    .doc(selectedModel).collection('variant')
    .doc(selectedVariant)
    .set({
        'services': subServiceList,
        'variantname': variantname
      })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  getAllSubServiceList(selectedService): Observable<SubService[]> {
    this.subServicesList = this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as SubService;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.subServicesList;
  }
  getSubServicesList(selectedService): Observable<any> {
    this.subServicesList = this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as SubService;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.subServicesList;
  }

  getAllUsersList(): Observable<any> {
    this.users = this.afs.collection('users').snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Vehicle;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.users;
  }

  updateGroup(group, groupId) {
    let result: any;
    console.log(group);
    this.afs.collection('groups').doc(groupId)
    .set({
      groupCreateBy: group.groupCreateBy,
      groupCreateDate: group.groupCreateDate,
      groupId: group.groupId,
      groupIsDeleted: group.groupIsDeleted,
      groupName: group.groupName,
      groupUpdateBy: group.groupUpdateBy,
      groupUpdateDate: group.groupUpdateDate
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  getAllGroupList(): Observable<any> {
    this.users = this.afs.collection('groups').snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Vehicle;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.users;
  }

  getAllBuildingList(selectedGroup): Observable<any> {
    this.buildingList = this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Building;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.buildingList;
  }

  getAllTenantList(selectedGroup, selectedBuilding) {
    this.tenantList = this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .doc(selectedBuilding).collection('tenants')
    .snapshotChanges()
    .map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Tenant;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    });
    return this.tenantList;
  }
  getAllBrandByVehicleType(vehicleTypeId): any {
    this.allBrandsByVehicleType =  this.afs.collection('vehicle').doc(vehicleTypeId).collection('brand').snapshotChanges()
    .map( (actions, index) => {
      return actions.map(action => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.allBrandsByVehicleType;
  }

  getAllModels(vehicleType, brandId): Observable<any> {
    this.models = this.afs.collection<Vehicle>('vehicle')
    .doc(vehicleType).collection('brand')
    .doc(brandId).collection<Model>('model')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Model;
        const id = action.payload.doc.id;
        return { id, ...data} ;
      });
    });
    return this.models;
  }

  getAllVariant(selectedVehicleType, selectedBrand, selectedModel): Observable<any> {
    this.variants = this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(selectedBrand).collection('model')
    .doc(selectedModel).collection('variant')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Variant;
        const id = action.payload.doc.id;
        return { id, ...data} ;
      });
    });
    return this.variants;
  }

  getTaskList(selectedService, selectedSubService, task): Observable<any> {
    this.variants = this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService).collection('task')
    .snapshotChanges()
    .map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Variant;
        const id = action.payload.doc.id;
        return { id, ...data} ;
      });
    });
    return this.variants;
  }

  addService(service): void {
    console.log('addService params ', service);
    let result: any;
    this.afs.collection('service_master')
    .add(
      {'service_display_name': service.service_display_name,
      'service_name': service.service_name,
      'vehicle_type': service.vehicle_type,
      'vehicle_type_id': service.vehicle_type_id
    })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addNewGroup(group) {
    let result: any;
    this.afs.collection('groups')
    .add({
      groupCreateBy: group.groupCreateBy,
      groupCreateDate: group.groupCreateDate,
      groupId: group.groupId,
      groupIsDeleted: group.groupIsDeleted,
      groupName: group.groupName
    })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addVehicleBrand(brandValue, selectedVehicleType): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .add({'brandname': brandValue})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addVehicleModel(selectedVehicleType, brandId, modelname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model')
    .add({'modelname': modelname})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addNewBuilding(selectedGroup, building) {
    let result: any;
    this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .add({
      buildingCreateBy: building.buildingCreateBy,
      buildingCreateDate: building.buildingCreateDate,
      buildingIsDeleted: 'N',
      buildingName: building.buildingName,
      buildingWorkHours: building.buildingWorkHours,
      buildingLocation: building.buildingLocation
    })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addVehicleVariant(selectedVehicleType, brandId, modelId, variantname): void {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model')
    .doc(modelId).collection('variant')
    .add({'variantname': variantname})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addNewTenant(selectedGroup, selectedBuilding, tenant) {
    let result: any;
    this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .doc(selectedBuilding).collection('tenants')
    .add({
      tenantCreateBy: tenant.tenantCreateBy,
      tenantCreateDate: tenant.tenantCreateDate,
      tenantIsDeleted: tenant.tenantIsDeleted,
      tenantName: tenant.tenantName,
      tenantStatus: tenant.tenantStatus,
      tenantVisitType: tenant.tenantVisitType,
      tenantWorkHours: tenant.tenantWorkHours
    })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }
  addSubService(selectedService, subService): void {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .add({
      'sub_service_display_name': subService.sub_service_display_name,
      'sub_service_name': subService.sub_service_name})
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  addTask(selectedService, selectedSubService, task): void {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService).collection('task')
    .add({
      'task_description': task.task_description,
      'task_name': task.task_name
    })
    .then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateUser(user) {
    let result: any;
    console.log(user);
    this.afs.collection('users').doc(user.id)
    .set({
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      userMobile: user.userMobile,
      userRole: user.userRole,
      userCreateBy: user.userCreateBy,
      userCreateDate: user.userCreateDate,
      userUpdateBy: user.userUpdateBy,
      userUpdateDate: user.userUpdateDate,
      userIsDeleted: user.userIsDeleted,
      userModifiedAt: new Date().getTime()
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateService(selectedService, service) {
    console.log('updateService params ', service);
    let result: any;
    this.afs.collection('service_master').doc(selectedService)
    .set({
      'service_display_name': service.service_display_name,
      'service_name': service.service_name,
      'vehicle_type': service.vehicle_type,
      'vehicle_type_id': service.vehicle_type_id
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateSubService(selectedService, subServiceId, subService) {
    let result: any;
    this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service').doc(subServiceId)
    .set({
      'sub_service_display_name': subService.sub_service_display_name,
      'sub_service_name': subService.sub_service_name
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateTask(selectedService, selectedSubService, taskId, task) {
    let result: any;
    this.afs.collection('service_master').doc(selectedService)
    .collection('sub_service').doc(selectedSubService)
    .collection('task').doc(taskId)
    .set({
      'task_description': task.task_description,
      'task_name': task.task_name
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateModel(selectedVehicleType, brandId, modelId, modelname) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .set({
      modelname: modelname
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateBuilding(selectedGroup, building, buildingId) {
    console.log(building);
    let result: any;
    this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .doc(buildingId)
    .set({
      buildingCreateBy: building.buildingCreateBy,
      buildingCreateDate: building.buildingCreateDate,
      buildingIsDeleted: building.buildingIsDeleted,
      buildingName: building.buildingName,
      buildingUpdateBy: building.buildingUpdateBy,
      buildingUpdateDate: building.buildingUpdateDate,
      buildingWorkHours: building.buildingWorkHours
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }
  updateVariant(selectedVehicleType, brandId, modelId, variantId, variantname) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .collection('variant').doc(variantId)
    .set({
      variantname: variantname
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  updateTenant(selectedGroup, selectedBuilding, tenant, tenantId) {
    console.log(tenant);
    console.log(tenantId);
    let result: any;
    this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .doc(selectedBuilding).collection('tenants').doc(tenantId)
    .set({
      tenantCreateBy: tenant.tenantCreateBy,
      tenantCreateDate: tenant.tenantCreateDate,
      tenantIsDeleted: tenant.tenantIsDeleted,
      tenantName: tenant.tenantName,
      tenantStatus: tenant.tenantStatus,
      tenantVisitType: tenant.tenantVisitType,
      tenantWorkHours: tenant.tenantWorkHours,
      tenantUpdateBy: tenant.tenantUpdateBy,
      tenantUpdateDate: tenant.tenantUpdateDate
    }).then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeBrand(brandId, selectedVehicleType) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeGroup(groupId) {
    let result: any;
    this.afs.collection('groups')
    .doc(groupId).delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeUser(userId) {
    let result: any;
    this.afs.collection('users')
    .doc(userId).delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeBuilding(selectedGroup, selectedBuilding, buildingId) {
    let result: any;
    this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .doc(selectedBuilding).delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }
  removeModel(selectedVehicleType, brandId, modelId) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeVariant(selectedVehicleType, brandId, modelId, variantId) {
    let result: any;
    this.afs.collection('vehicle')
    .doc(selectedVehicleType).collection('brand')
    .doc(brandId).collection('model').doc(modelId)
    .collection('variant').doc(variantId)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeTenant(selectedGroup, selectedBuilding, tenantId) {
    let result: any;
    this.afs.collection('groups')
    .doc(selectedGroup).collection('buildings')
    .doc(selectedBuilding).collection('tenants').doc(tenantId)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeMainService(selectedService) {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeSubService(selectedService, selectedSubService) {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

  removeTask(selectedService, selectedSubService, taskId) {
    let result: any;
    this.afs.collection('service_master')
    .doc(selectedService).collection('sub_service')
    .doc(selectedSubService).collection('task')
    .doc(taskId)
    .delete().then( docRef => {
      result = 'success';
    }).catch( error => {
      result = 'Something went wrong';
    });
  }

}
