// view-citation-available.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreCitationService } from '../../../../shared/services/Hospital/core-citation.service';

// Interfaz para los horarios
interface Horario {
  hora: string;
  estaDisponible: boolean;
}

@Component({
  selector: 'app-view-citation-available',
  standalone: false,
  templateUrl: './view-citation-available.component.html',
  styleUrls: ['./view-citation-available.component.css']
})
export class ViewCitationAvailableComponent implements OnInit {

  idTypeCitation: number = 0;
  todos: boolean = true;
  
  // Data del calendario
  selectedDate: string | null = null;
  blocks: Horario[] = [];
  
  // Horarios separados
  horariosManana: Horario[] = [];
  horariosTarde: Horario[] = [];
  
  // Toggle para vista
  vistaColumnas = false;
  
  // Data quemada por ahora
  especialidad = 'Medicina General';
  nombreDoctor = 'Dr. Ortis Acosta Jhoyner Duvan';

  constructor(
    private service: CoreCitationService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idTypeCitation = idParam ? +idParam : 0;
  }

  // Handler cuando cambia la fecha
  onDateChange(date: string) {
    this.selectedDate = date;
    console.log('Padre recibe fecha:', date);
  }

  // Handler cuando se cargan los bloques
  onBlocksLoaded(data: Horario[]) {
    this.blocks = data;
    console.log('Padre recibe bloques:', data);
    this.separarHorarios();
  }

  // Separar horarios entre mañana y tarde
  private separarHorarios() {
    this.horariosManana = [];
    this.horariosTarde = [];
    
    this.blocks.forEach(horario => {
      const hora = parseInt(horario.hora.split(':')[0]);
      
      // Consideramos mañana de 6:00 a 13:59 y tarde de 14:00 a 23:59
      if (hora >= 6 && hora < 14) {
        this.horariosManana.push(horario);
      } else {
        this.horariosTarde.push(horario);
      }
    });
    
    console.log('Horarios mañana:', this.horariosManana);
    console.log('Horarios tarde:', this.horariosTarde);
  }

  // Formatear hora de 24h a 12h
  formatearHora(hora: string): string {
    const [horas, minutos] = hora.split(':');
    const horaNum = parseInt(horas);
    const periodo = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum === 0 ? 12 : horaNum > 12 ? horaNum - 12 : horaNum;
    
    return `${hora12}:${minutos} ${periodo}`;
  }

  // Toggle vista
  toggleView() {
    this.vistaColumnas = !this.vistaColumnas;
  }

  // Seleccionar horario (solo si está disponible)
  seleccionarHorario(horario: Horario) {
    if (horario.estaDisponible) {
      console.log('Horario seleccionado:', horario);
      // Aquí puedes agregar tu lógica para manejar la selección
      // Por ejemplo, navegar a otra página, mostrar un modal, etc.
    }
  }
}