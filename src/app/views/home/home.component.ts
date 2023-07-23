import { TranslateService } from '@ngx-translate/core';
import { ActivityService } from './../../services/activity.service';
import { CategoryService } from 'src/app/services/category.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Category } from 'src/app/model/category.model';
import { MatTableDataSource } from '@angular/material/table';
import { Progress } from 'src/app/model/progress.model';
import { Activity } from 'src/app/model/activity.model';
import { DatePipe } from '@angular/common';
Chart.register(...registerables);
import * as ExcelJS from 'exceljs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chart: any;
  progressChart: any;
  dataSource = new MatTableDataSource<Category>([]);
  displayedColumns = ['categoryName', 'todoTasks', 'doneTasks', 'notStarted', 'overdue'];
  progress: Progress;
  activity: Activity;

  @ViewChild('activityChartContainer', { static: false }) el!: ElementRef

  constructor(
    private categoryService: CategoryService,
    private activityService: ActivityService,
    private datePipe: DatePipe,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getActivity()
    this.getProgress();

    this.categoryService.categoryChange$.subscribe(() => {
      this.getCategories();
    });

    this.verificarChartData()
  }

  getActivity() {
    this.activityService.getActivity().subscribe({
      next: (data) => {
        this.activity = data
        this.createLineChart();
      }
    })
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<Category>(data);
      }
    })
  }

  getProgress() {
    this.categoryService.getProgress().subscribe({
      next: (data) => {
        this.progress = data;
        this.createProgressChart();
      }
    })
  }

  verificarChartData() {
    Chart.register({
      id: 'NoData',
      afterDatasetsDraw: function (chart) {

        if (chart.canvas.id === 'activityChart') {
          let dataArray: any = chart.data.datasets[0]
          const allZero = dataArray.data.every(value => value == 0);
          if (
            allZero
          ) {
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            chart.clear();

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 20px Montserrat';
            ctx.fillStyle = localStorage.getItem('ToDoV2Theme') == 'DARK' ? 'white' : 'black';

            if (localStorage.getItem("Language") == 'pt') {
              ctx.fillText('Nenhuma atividade nos últimos 7 dias.', width / 2, height / 2);
            } else {
              ctx.fillText("No activity in the last 7 days.", width / 2, height / 2);
            }
            ctx.restore();
          }
        }

        if (chart.canvas.id === 'progressChart') {
          let dataArray: any = chart.data.datasets[0]
          const allZero = dataArray.data.every(value => value == 0);
          if (
            allZero
          ) {
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            chart.clear();


            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 20px Montserrat';
            ctx.fillStyle = localStorage.getItem('ToDoV2Theme') == 'DARK' ? 'white' : 'black';
            if (localStorage.getItem("Language") == 'pt') {
              ctx.fillText('Você ainda não possui nenhuma tarefa.', width / 2, height / 2);
            } else {
              ctx.fillText("You don't have any tasks yet.", width / 2, height / 2);
            }
            ctx.restore();
          }
        }
      },
    });
  }

  createLineChart() {
    const data = [
      this.activity.day_7.doneTasks.length,
      this.activity.day_6.doneTasks.length,
      this.activity.day_5.doneTasks.length,
      this.activity.day_4.doneTasks.length,
      this.activity.day_3.doneTasks.length,
      this.activity.day_2.doneTasks.length,
      this.activity.day_1.doneTasks.length,
    ]

    const labels = [
      this.activity.day_7.currentDayName,
      this.activity.day_6.currentDayName,
      this.activity.day_5.currentDayName,
      this.activity.day_4.currentDayName,
      this.activity.day_3.currentDayName,
      this.translateService.instant('HOME.Ontem'),
      this.translateService.instant('HOME.Hoje')
    ]

    const bgColor = {
      id: 'bgColor',
      beforeDraw: (chart, options) => {
        const { ctx, width, height } = chart;
        ctx.fillStyle = localStorage.getItem('ToDoV2Theme') == 'DARK' ? '#1f1e1e' : '#cdcdcd';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    }

    this.chart = new Chart("activityChart", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.translateService.instant("HOME.TarefasConcluidas"),
            data: data,
          }
        ]
      },
      options: {
        // Para desligar a legenda em cima do gráfico
        plugins: {
          legend: {
            display: false
          }
        },
        // Para deixar responsivo
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              color: localStorage.getItem('ToDoV2Theme') == 'DARK' ? 'white' : '#101010',
              font: {
                family: 'Montserrat, sans-serif'
              }
            },
            beginAtZero: true
          },
          x: {
            ticks: {
              color: localStorage.getItem('ToDoV2Theme') == 'DARK' ? 'white' : '#101010',
              font: {
                family: 'Montserrat, sans-serif'
              }
            }
          }
        }
      },
      plugins: [bgColor]
    });
  }

  createProgressChart() {
    const data = {
      labels: [
        this.translateService.instant("HOME.TarefasAFazer"),
        this.translateService.instant("HOME.TarefasConcluidas"),
        this.translateService.instant("HOME.TarefasNaoIniciadas"),
        this.translateService.instant("HOME.TarefasExpiradas"),
      ],
      datasets: [{
        label: this.translateService.instant("HOME.Tarefas"),
        labelColor: localStorage.getItem('ToDoV2Theme') == 'DARK' ? 'white' : '#101010',
        data: [this.progress.todoTasks, this.progress.doneTasks, this.progress.notStartedTasks, this.progress.expiredTasks],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(30, 215, 96)',
          'rgb(202, 162, 42)',
          'rgb(227, 48, 41)',
        ],
        borderColor: [
          'rgb(114, 197, 252)',
          'rgb(35, 255, 113)',
          'rgb(255, 204, 53)',
          'rgb(255, 80, 46)',
        ],
        hoverOffset: 4
      }]

    };

    const bgColor = {
      id: 'bgColor',
      beforeDraw: (chart, options) => {
        const { ctx, width, height } = chart;
        ctx.fillStyle = localStorage.getItem('ToDoV2Theme') == 'DARK' ? '#1f1e1e' : '#cdcdcd';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    }

    this.progressChart = new Chart("progressChart", {
      type: 'doughnut',
      data: data,
      options: {
        // Para deixar responsivo
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: localStorage.getItem('ToDoV2Theme') == 'DARK' ? 'white' : 'black',
              font: {
                family: 'Montserrat, sans-serif'
              }
            }
          },
        }
      },
      plugins: [bgColor]
    });
  }


  exportarExcel(nomeTabela) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabela');

    const colunasPt = ['Categoria', 'A fazer', 'Finalizadas', 'Não iniciadas', 'Expiradas'];

    //Adiciona o Header das colunas
    const headerRow = worksheet.addRow(colunasPt);
    headerRow.font = { bold: true };

    let linha = 1;
    //Preenche a cor do background e a cor do texto do Header
    for (let i = 1; i <= colunasPt.length; i++) {
      const cell = worksheet.getCell(linha, i);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b8b8b8' }
      };
      cell.font = {
        color: { argb: '000000' }
      };
    }

    this.dataSource.data.forEach(row => {
      linha++;
      worksheet.addRow([
        row.name,
        row.todoTasks.length,
        row.doneTasks.length,
        row.notStartedTasks.length,
        row.expiredTasks.length,
      ]);
    });

    //gera o arquivo
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeTabela + '.xlsx';
      a.click();
    });
  }

  /*exportPDF(nomeTabela) {
    const documentDefinition = {
      content: [
        { text: 'Tabela de tarefas', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Categoria', style: 'tableHeader' },
                { text: 'Tarefas a fazer', style: 'tableHeader' },
                { text: 'Tarefas concluídas', style: 'tableHeader' },
                { text: 'Tarefas não iniciadas', style: 'tableHeader' },
                { text: 'Tarefas expiradas', style: 'tableHeader' },
              ],
              ...this.dataSource.data.map(row => [
                row.name,
                row.todoTasks.length,
                row.doneTasks.length,
                row.notStartedTasks.length,
                row.expiredTasks.length
              ])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    };
    pdfMake.createPdf(documentDefinition).download(nomeTabela + '.pdf');
  }*/

  generatePdf(nomeElemento, nomeTabela) {
    const canvas = document.getElementById(nomeElemento) as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL();

    const docDefinition = {
      content: [
        {
          text: nomeTabela,
          style: 'header',
          alignment: 'center'
        },
        {
          text: localStorage.getItem('ToDoV2Theme') == 'DARK' ? '(Dark Theme)' : '(Light Theme)',
          style: 'theme'
        },
        {
          image: dataUrl,
          width: 520,
          alignment: 'center',
        },
        {
          text: "Dados referentes aos dias " + this.datePipe.transform(this.activity.day_1.currentDay , 'dd/MM/yyyy') + " a " + this.datePipe.transform(this.activity.day_7.currentDay , 'dd/MM/yyyy') + ".",
          style: 'subtitle'
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        theme: {
          fontSize: 9,
          margin: [0, 0, 0, 3],
          color: '#4b4b4b'
        },
        subtitle: {
          fontSize: 9,
          margin: [0, 3, 0, 0],
          color: '#4b4b4b'
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('meu-grafico.pdf');
  }


}
