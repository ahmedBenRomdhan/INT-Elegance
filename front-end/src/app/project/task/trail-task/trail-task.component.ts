import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Trail } from '../../../models/trail';
import { Task } from '../model/task';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { noDataFound } from 'src/app/utils/variables';
import { canceledStatus } from '../../utils/variables';

@Component({
  selector: 'app-trail-task',
  templateUrl: './trail-task.component.html',
  styleUrls: ['./trail-task.component.scss']
})
export class TrailTaskComponent implements OnInit {

  taskId: any;
  projectId: any;
  trailTaskList: Trail[] = [];
  canceledStatus = canceledStatus
  taskStatus: string = ''

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource = new MatTableDataSource<Trail>();

  noData = noDataFound

  constructor(private dataService: DataService, private activated: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {
    this.taskId = this.activated.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getTrailTasksList()
    this.getTaskDetails()
    this.changeDetectorRef.detectChanges();
  }

  getTrailTasksList() {
    //@ts-ignore
    this.dataService.getCollection(new Trail(), '/task/' + this.taskId)
      .pipe()
      .subscribe((result) => {
        if (result) {
          this.trailTaskList = result
          for (let i = 0; i < result.length; i++) {
            this.trailTaskList[i].attributes = JSON.parse(this.trailTaskList[i].attributes)
            this.trailTaskList[i].newValues = JSON.parse(this.trailTaskList[i].newValues)
            this.trailTaskList[i].oldValues = JSON.parse(this.trailTaskList[i].oldValues)
          }
          this.dataSource = new MatTableDataSource(this.trailTaskList);
          this.dataSource.paginator = this.paginator;
          this.obs = this.dataSource.connect();
        }
      })
  }

  getTaskDetails() {
    // @ts-ignore
    const task = new Task();
    task.setId(this.taskId);
    //@ts-ignore
    this.dataService.getItem(task, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.projectId = res.phase.projectId;
        this.taskStatus = res.status
      })
  }
}
