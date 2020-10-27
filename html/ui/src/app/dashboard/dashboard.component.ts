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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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
  usage_avg: number;
  usage_per: string;

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

  private systemOS(data): void {
    this.platform = `${data.os.platform} / ${data.os.release}`;
    const hours = Math.floor(data.os.uptime / 60 / 60);
    const minutes = Math.floor(data.os.uptime / 60) - (hours * 60);
    const seconds = data.os.uptime % 60;
    this.uptime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private systemCPU(data): void {
    this.model = `${data.cpu.model}`;
    this.usage_avg = +`${Math.round(data.cpu.usage)}`;
    this.usage_per = `${Math.round(data.cpu.usage)}%`;
  }

  private systemMemory(system): void {
    this.memUsageAvg = +`${100 - system.memory.freeAvg}`;
    this.memUsagePer = `${system.memory.used} / ${system.memory.total}GB (${system.memory.usedAvg}%)`;
  }
}
