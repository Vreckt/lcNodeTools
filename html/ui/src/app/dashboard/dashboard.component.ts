import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SocketService } from '../shared/services/socket.service';

export interface Application {
  name: string;
  path: string;
  port: string;
  startableFile: string;
  description: string;
  status: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['status', 'name', 'port', 'filename', 'action'];
  dataSource = new MatTableDataSource<Application>();

  // OS
  platform: string;
  uptime: string;
  // CPU
  model: string;
  usageavg: number;
  // memory
  memUsageAvg: number;
  memUsagePer: string;

  constructor(private socket: SocketService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.socket.systemInfo().subscribe(data => {
        this.systemOS(data);
        this.systemCPU(data);
        this.systemMemory(data);
      });
      this.socket.applicationList().subscribe((data: Application[]) => {
        console.log(data);
        this.dataSource.data = data;
      });
    });
  }

  updateStatus(app: Application): void {
    this.socket.updateStatus(app);
    app.status = !app.status;
  }

  onEdit(app: Application): void {

  }

  onDelete(app: Application): void {
    this.socket.delete(app);
  }

  private systemOS(data): void {
    this.platform = `${data.os.platform} / ${data.os.release}`;
    const hours = Math.floor(data.os.uptime / 60 / 60);
    const minutes = Math.floor(data.os.uptime / 60) - (hours * 60);
    const seconds = data.os.uptime % 60;
    this.uptime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private systemCPU(data): void {
    this.model = `${data.cpu.model}`;
    this.usageavg = +`${Math.round(data.cpu.usage)}`;
  }

  private systemMemory(system): void {
    this.memUsageAvg = +`${100 - system.memory.freeAvg}`;
    this.memUsagePer = `${system.memory.used} / ${system.memory.total}GB (${system.memory.usedAvg}%)`;
  }
}
