import { Injectable } from '@angular/core';
import { ServiceBaseService } from './base/service-base.service';
import { BranchCreated, BranchEdit, BranchList } from '../Models/parameter/Branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends ServiceBaseService<BranchList,BranchCreated,BranchEdit> {
  constructor() {
    super('Branch');
  }
}
