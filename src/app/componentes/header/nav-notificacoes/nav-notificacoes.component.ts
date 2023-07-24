import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Notification } from 'src/app/model/notification.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-nav-notificacoes',
  templateUrl: './nav-notificacoes.component.html',
  styleUrls: ['./nav-notificacoes.component.css']
})
export class NavNotificacoesComponent implements OnInit {

  constructor(
    private notificationsService: NotificationService,
    private router: Router
  ) { }

  loaded = false;

  notificationPanelState = false;
  allNotificationsList: Notification[] = [];
  unreadNotificationsList: any[] = [];
  notVisualizedNotificationsList: any[] = [];

  notificationsStatus = 'all';

  ngOnInit() {
    this.getAllNotifications();
  }

  getAllNotifications() {
    this.loaded = false;

    this.notificationsService.getAllNotifications().subscribe({
      next: (res) => {
        this.allNotificationsList = res;
        this.notVisualizedNotificationsList = res.filter(x => x.visualized == false);
        this.unreadNotificationsList = res.filter(x => x.clicked == false);
        this.loaded = true;
      }
    });
  }

  viewNotificationDetails(notification) {
    if (notification.clicked) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['notifications', `${notification.id}`]);
      });
      this.notificationPanelState = false;
    } else {
      this.loaded = false;

      this.notificationsService.setNotificationAsClicked(notification.id).subscribe({
        complete: () => {
          this.notificationsService.setAllAsVisualized().subscribe({
            complete: () => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['notifications', `${notification.id}`]);
              });
              this.getAllNotifications();
              this.notificationPanelState = false;
            }
          });
        }
      });

      this.setAllAsVisualized();
    }
  }

  setAllAsVisualized() {
    this.notificationPanelState = false;
    this.loaded = false;
    
    this.notificationsService.setAllAsVisualized().subscribe({
      complete: () => {
        this.getAllNotifications();
        this.notificationPanelState = false;
      }
    });
    
  }

}
