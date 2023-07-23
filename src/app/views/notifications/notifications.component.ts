import { Component, OnInit, ViewChild, HostListener, HostBinding  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { CreateCategoryModalComponent } from 'src/app/componentes/header/modal/create-category-modal/create-category-modal.component';
import { Notification } from 'src/app/model/notification.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ModalNotificationTasksComponent } from './modal-notification-tasks/modal-notification-tasks.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('notificationsTable') sort1: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;

  displayedColumns = ['actions', 'title', 'description', 'date'];
  expandedElement: any
  loaded = false;

  dataSource = new MatTableDataSource<Notification>([]);
  notificationId: number;

  constructor(
    private notificationsService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
    ) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.notificationId = params['id'];
    });
    
    this.getAllNotifications();
  }

  adicionarOuvinteDeCliqueNaTela() {
    document.addEventListener('click', this.onClick.bind(this));
  }

  onClick(event: MouseEvent) {
    const currentRoute = this.router.url;
    if (currentRoute.includes('/notifications') && this.notificationId ) {
      console.log(this.notificationId)
      this.notificationId = null;
      console.log(null)
    }
  }

  getAllNotifications() {
    this.loaded = false;

    this.notificationsService.getAllNotifications().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource<Notification>(res);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator1;
          this.dataSource.sort = this.sort1;
        }, 0);

        this.dataSource.filterPredicate = (data: any, filter: string) => {
          if (data.description?.toLowerCase().trim().includes(filter)) {
            return true
          } else {
            return false
          }
        }
        this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {

          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }
        
          return data[sortHeaderId];
        };

        this.loaded = true;

        this.adicionarOuvinteDeCliqueNaTela();

      }
    });
  }

  filterNotifications(event){
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openTasksModal(row){
    const dialogRef = this.dialog.open(ModalNotificationTasksComponent, {
      width: '600px',
      maxHeight: '700px',
      panelClass: 'modalStyle',
      backdropClass: 'modalStyleBackdrop',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.componentInstance.tasks = row.tasks;
  }

}
