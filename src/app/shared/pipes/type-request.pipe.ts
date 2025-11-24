import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeRequest'
})
export class TypeRequestPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 0: return 'Desbloqueo';
      case 1: return 'Falta';
      case 2: return 'Otro';
      default: return 'N/A';
    }
  }
}