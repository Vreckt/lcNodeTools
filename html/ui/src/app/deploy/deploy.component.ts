import { Component, OnInit } from '@angular/core';
import { Application } from '../shared/models/application';
import { SocketService } from '../shared/services/socket.service';
import { HttpService } from '../shared/services/http.service';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.scss']
})
export class DeployComponent implements OnInit {
  selectedFile: File;
  files: File[] = [];
  private formData: FormData = new FormData();

  constructor(private socketService: SocketService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
  }

  onFileChanged(event): void {
    // const deployedFile = Array.from(event.target.files).find((f: File) => f.name === 'configs.json')[0];
    // this.selectedFile = event.target.files[0];
    // const fileReader = new FileReader();
    // fileReader.readAsText(deployedFile, 'UTF-8');
    // fileReader.onload = () => {
    //   const test = JSON.parse(JSON.parse(JSON.stringify(fileReader.result)));
    //   const app = Application.createByJSON(test.app.name, test.app.path, test.app.port, test.app.main, test.app.description);
    //   console.log(app);
    // };
    // fileReader.onerror = (error) => {
    //   console.log(error);
    // };
  }

  onSelect(event): void {
    this.files.push(...event.addedFiles);
    this.files = [this.files[this.files.length - 1]];
    this.formData = new FormData();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      this.formData.append('file', this.files[i]);
    }
  }

  onRemove(event): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onUpload(): void {
    this.httpService.addHero(this.formData).subscribe(data => {
      console.log(data);
      this.files = [];
      this.formData = new FormData();
    });
  }
}
