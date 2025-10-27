import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../../Models/ManuItemModel';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

 private menuItemsSource = new BehaviorSubject<MenuItem[]>([]);
  menuItems$ = this.menuItemsSource.asObservable();

  setMenuItems(items: MenuItem[]) {
    this.menuItemsSource.next(items);
  }

  getCurrentMenu(): MenuItem[] {
    return this.menuItemsSource.getValue();
  }
}
