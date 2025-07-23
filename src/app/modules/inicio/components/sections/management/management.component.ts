import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent  implements OnInit{

    @ViewChild('featuresSection') featuresSection!: ElementRef;
  
  features = [
    {
      id: 1,
      title: 'Agendamiento eficiente',
      description: 'Programa citas de manera sencilla con agendamiento en línea y gestión automática de disponibilidad.',
      icon: 'fas fa-calendar-check',
      color: '#e3f2fd',
      iconColor: '#2196f3'
    },
    {
      id: 2,
      title: 'Gestión de pacientes',
      description: 'Administra perfiles médicos, historiales médicos y comunicaciones para coordinar la atención del paciente.',
      icon: 'fas fa-user-md',
      color: '#f3e5f5',
      iconColor: '#9c27b0',
    },
    {
      id: 3,
      title: 'Recordatorios y seguimientos',
      description: 'Envía recordatorios automáticos y realiza seguimiento de citas para reducir ausencias y mejorar la adherencia.',
      icon: 'fas fa-bell',
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
          const cards = entry.target.querySelectorAll('.feature-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, index * 150);
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // El observer se aplicará cuando el componente esté en el DOM
    setTimeout(() => {
      if (this.featuresSection?.nativeElement) {
        observer.observe(this.featuresSection.nativeElement);
      }
    }, 100);
  }
}
