import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SheduleCardComponent } from './shedule-card.component';

describe('SheduleCardComponent', () => {
  let component: SheduleCardComponent;
  let fixture: ComponentFixture<SheduleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheduleCardComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SheduleCardComponent);
    component = fixture.componentInstance;

    // ✅ CORRECCIÓN: Proveer datos falsos obligatorios
    component.schedule = {
      id: 1,
      day: 'Lunes',
      startTime: '08:00',
      endTime: '12:00',
      breakStartTime: '10:00',
      breakEndTime: '10:30',
      place: 'Consultorio 1',
      status: true,
      isEditing: false,
      consultingRoomName: 'Sala 1',
      typeCitationName: 'General',
      nameDoctor: 'Dr. Test',
      // Agrega aquí cualquier otra propiedad que use tu HTML
      IcontypeCitation: 'icon.png',
    } as any; // 'as any' por si me falta alguna propiedad de tu interfaz

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
