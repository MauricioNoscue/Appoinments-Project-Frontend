import { Component, OnInit } from '@angular/core';
import { Chart, ChartOptions, ChartData, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  // Datos quemados
  labels: string[] = [
    'Label 1',
    'Label 2',
    'Label 3',
    'Label 4',
    'Label 5',
    'Label 6',
  ];
  values: number[] = [12, 22, 12, 12, 7, 7];

  // Colores (ordenados como en la leyenda/imagen)
  colors: string[] = [
    '#23BBAA', // Label 1
    '#3F7CF6', // Label 2
    '#6B6BF7', // Label 3
    '#F2589C', // Label 4
    '#F39B1F', // Label 5
    '#F2CF2F', // Label 6
  ];

  total = 0;
  legendData: Array<{ label: string; value: number; percent: string }> = [];

  // ¡importante!: usa "!" para evitar el error de inicialización
  chart!: Chart<'doughnut', number[], string>;

  ngOnInit(): void {
    this.total = this.values.reduce((a, b) => a + b, 0);

    this.legendData = this.labels.map((label, i) => {
      const value = this.values[i];
      const percent = this.total
        ? ((value / this.total) * 100).toFixed(1)
        : '0.0';
      return { label, value, percent };
    });

    // Plugin para texto centrado (total y subtítulo)
    const centerTextPlugin = {
      id: 'centerText',
      afterDraw: (chart: Chart) => {
        const { ctx, chartArea } = chart;
        if (!ctx || !chartArea) return;

        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Subtítulo gris
        ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        ctx.fillStyle = '#9aa0a6';
        ctx.fillText('Total Value', centerX, centerY - 14);

        // Total grande
        ctx.font =
          'bold 28px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        ctx.fillStyle = '#202124';
        ctx.fillText(String(this.total), centerX, centerY + 10);

        ctx.restore();
      },
    };

    const data: ChartData<'doughnut', number[], string> = {
      labels: this.labels,
      datasets: [
        {
          data: this.values,
          backgroundColor: this.colors,
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%', // grosor del anillo
      plugins: {
        legend: { display: false },
        title: {
          display: false, // el título lo dejamos en HTML
          text: 'Comportamiento del año',
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed;
              const p = this.total
                ? ((v / this.total) * 100).toFixed(1)
                : '0.0';
              return `${ctx.label}: ${v} (${p}%)`;
            },
          },
        },
      },
    };

    // Crea el gráfico
    this.chart = new Chart('MyChart', {
      type: 'doughnut',
      data,
      options,
      plugins: [centerTextPlugin],
    });
  }



}
