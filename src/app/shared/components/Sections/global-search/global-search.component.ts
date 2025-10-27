import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../../Models/ManuItemModel';
import { MenuService } from '../../../services/Menu/menu.service';

@Component({
  selector: 'app-global-search',
  standalone:false,
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.css',
   encapsulation: ViewEncapsulation.None 
})
export class GlobalSearchComponent {

  searchTerm = '';
  results: any[] = [];
  showResults = false;

  constructor(private router: Router, private menuService: MenuService) {}

  onSearch(): void {
    const menuItems = this.menuService.getCurrentMenu();
    const term = this.searchTerm.toLowerCase();

    const flatten = (items: MenuItem[]): any[] => {
      let result: any[] = [];
      for (const item of items) {
        if (item.type === 'item' && item.title) {
          result.push({ title: item.title, route: item.url });
        }
        if (item.children) result = result.concat(flatten(item.children));
      }
      return result;
    };

    const allRoutes = flatten(menuItems);

    this.results = allRoutes.filter(r =>
      r.title.toLowerCase().includes(term)
    );

    this.showResults = this.results.length > 0;
  }

  selectResult(result: any) {
    this.showResults = false;
    this.router.navigate([result.route]);
  }
}
