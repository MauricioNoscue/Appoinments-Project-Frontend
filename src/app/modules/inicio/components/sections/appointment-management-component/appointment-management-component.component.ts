import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-appointment-management-component',
  standalone:false,
  templateUrl: './appointment-management-component.component.html',
  styleUrl: './appointment-management-component.component.css'
})
export class AppointmentManagementComponent implements OnInit {
  @ViewChild('managementSection') managementSection!: ElementRef;
  
  features = [
    {
      id: 1,
      title: 'Centro de solicitudes',
      description: 'Gestiona nuevas citas y solicitudes médicas desde un solo lugar. Mantén el control de lo que llega día a día.',
      icon: 'fas fa-inbox',
      color: '#e3f2fd',
      iconColor: '#2196f3',
      highlighted: true
    },
    {
      id: 2,
      title: 'Calendario',
      description: 'Facilita la programación de la citas y el manejo del calendario diario. Visualiza claramente tu agenda.',
      icon: 'fas fa-calendar-alt',
      color: '#f3e5f5',
      iconColor: '#9c27b0'
    },
    {
      id: 3,
      title: 'Registros',
      description: 'Accede rápidamente al historial de cada paciente. Organiza la información según tus necesidades.',
      icon: 'fas fa-folder-open',
      color: '#e8f5e8',
      iconColor: '#4caf50'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.feature-item');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, index * 200);
          });
          
          // Animar imagen después de las tarjetas
          const imageSection = entry.target.querySelector('.dashboard-image-section');
          if (imageSection) {
            setTimeout(() => {
              imageSection.classList.add('animate-in');
            }, cards.length * 200 + 300);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    setTimeout(() => {
      if (this.managementSection?.nativeElement) {
        observer.observe(this.managementSection.nativeElement);
      }
    }, 100);
  }
}
