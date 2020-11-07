import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Application } from 'src/app/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  observer;
  AppsObserver;
  constructor() { }

  setupSocketConnection(): void {
    this.socket = io(environment.SOCKET_ENDPOINT);
    console.log('connect');
    this.setup();
  }

  setup(): void {
    this.socket.emit('servers');
    this.systemInfo();
    this.applicationList();
  }

  updateStatus(app: Application): void {
    this.socket.emit('update status', app);
  }

  delete(app: Application): void {
    this.socket.emit('delete', app);
  }

  deploy(files): void {
    this.socket.emit('deploy', files);
  }

  systemInfo(): Observable<any> {
    this.socket.on('system-info', (data: string) => {
      this.observer.next(data);
    });
    return new Observable(observer => {
      this.observer = observer;
    });
  }

  applicationList(): Observable<any> {
    this.socket.on('result', (data: string) => {
      this.AppsObserver.next(data);
    });
    return new Observable(observer => {
      this.AppsObserver = observer;
    });
  }
}
