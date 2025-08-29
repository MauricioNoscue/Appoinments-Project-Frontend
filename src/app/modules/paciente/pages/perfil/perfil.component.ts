import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import Chart from 'chart.js/auto';

interface IPaciente {
  iniciales: string;
  nombre: string;
  nombreCompleto: string;
  nacimiento: string;
  genero: string;
  documento: string;
  eps: string;
  regimen: string;
  telefono: string;
  email: string;
  tolerancia: number; // 0..N (número de corazones rojos)
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatCard, MatIcon],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements AfterViewInit, OnDestroy {
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // ========= Corazones =========
  readonly totalCorazones = 3;
  readonly indices = Array.from({ length: this.totalCorazones }, (_, i) => i);

  // ========= Datos del paciente (quemado por ahora) =========
  paciente: IPaciente = {
    iniciales: 'DG',
    nombre: 'Daniel Gomez',
    nombreCompleto: 'Daniel Gomez Martinez',
    nacimiento: '16 de marzo 1985',
    genero: 'Masculino',
    documento: 'CC 1.023.456.789',
    eps: 'Nueva EPS',
    regimen: 'Contributivo',
    telefono: '+57 320 123 4567',
    email: 'daniel.gomez@example.com',
    tolerancia: 1,
  };

  // Getter para evitar el error del @ en el template
  get emailEscapado(): string {
    return this.paciente.email.replace('@', '&#64;');
  }

  // ========= Gráfica =========
  labels = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6'];
  values = [12, 22, 12, 12, 7, 7];
  colors = ['#4F8DF5', '#5AC05A', '#F7B84B', '#E85A74', '#7C89FF', '#24C1C7'];
  total = this.values.reduce((a, b) => a + b, 0);
  items = this.labels.map((label, i) => ({
    label,
    value: this.values[i],
    percent: (this.values[i] / this.total) * 100,
    color: this.colors[i],
  }));

  // ========= (Opcional) Ejemplo para reemplazar por API =========
  // Llama esto cuando tengas tu servicio listo (HttpClient):
  // loadPacienteFromApi() {
  //   this.miServicio.getPacientePerfil().subscribe((res: any) => {
  //     // mapear/normalizar la respuesta del backend a IPaciente:
  //     this.paciente = {
  //       iniciales: res.iniciales ?? this.getIniciales(res.nombreCompleto),
  //       nombre: res.nombre ?? '',
  //       nombreCompleto: res.nombreCompleto ?? '',
  //       nacimiento: res.nacimiento ?? '',
  //       genero: res.genero ?? '',
  //       documento: res.documento ?? '',
  //       eps: res.eps ?? '',
  //       regimen: res.regimen ?? '',
  //       telefono: res.telefono ?? '',
  //       email: res.email ?? '',
  //       tolerancia: this.clamp(Number(res.tolerancia), 0, this.totalCorazones),
  //     };
  //   });
  // }

  private clamp(n: number, min: number, max: number) {
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }
  private getIniciales(nombreCompleto: string): string {
    if (!nombreCompleto) return '';
    const partes = nombreCompleto.trim().split(/\s+/);
    const ini = (partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '');
    return ini.toUpperCase();
  }

  // ========= Chart.js =========
  ngAfterViewInit(): void {
    const centerTextPlugin: any = {
      id: 'centerText',
      afterDraw: (chart: Chart) => {
        const { ctx, chartArea } = chart as any;
        if (!chartArea) return;
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 28px Inter, Roboto, Arial, sans-serif';
        ctx.fillStyle = '#111827';
        ctx.fillText(String(this.total), x, y);
        ctx.restore();
      },
    };

    this.chart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: this.colors,
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = Number(ctx.raw);
                const p = (v / this.total) * 100;
                return `${ctx.label}: ${v} (${p.toFixed(1)}%)`;
              },
            },
          },
        },
      },
      plugins: [centerTextPlugin],
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
