import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Project } from '../model/project';
import { Trail } from '../../../models/trail';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { noDataFound } from 'src/app/utils/variables';

@Component({
  selector: 'app-trail-project',
  templateUrl: './trail-project.component.html',
  styleUrls: ['./trail-project.component.scss']
})
export class TrailProjectComponent implements OnInit {
  projectId: any;
  trailProjectList: Trail[] = [];
  projectName: string = ""
  userName: string = ""
  usersList: string[] = []

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource = new MatTableDataSource<Trail>();

  noData = noDataFound

  constructor(private dataService: DataService, private activated: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {
    this.projectId = this.activated.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProjectDetails()
    this.getTrailProjectsList()
    this.changeDetectorRef.detectChanges();
  }

  getTrailProjectsList() {

    let index: any
    //@ts-ignore
    this.dataService.getCollection(new Trail(), '/project/' + this.projectId)
      .pipe()
      .subscribe((result) => {
        if (result) {

          this.trailProjectList = result
          this.trailProjectList.forEach((element: any) => {
            element.attributes = JSON.parse(element.attributes)
            if (element.oldValues && element.newValues && element.attributes) {
              index = element.attributes.indexOf('users')

              element.newValues = JSON.parse(element.newValues)
              element.oldValues = JSON.parse(element.oldValues)
              if (index != -1 && element.newValues[index] && element.oldValues[index]) {
                element.newValues[index] = element.newValues[index].filter((name: any) => !element.oldValues[index].includes(name));
                element.oldValues[index] = element.oldValues[index].filter((name: any) => !element.newValues[index].includes(name));
              }
            }
          });
          this.dataSource = new MatTableDataSource(this.trailProjectList);
          this.dataSource.paginator = this.paginator;
          this.obs = this.dataSource.connect();
        }


      })
  }

  getProjectDetails() {
    // @ts-ignore
    const project = new Project();
    project.setId(this.projectId);
    //@ts-ignore
    this.dataService.getItem(project, '/getOne')
      .pipe()
      .subscribe((res) => {
        this.projectName = res.name;
      })
  }
}
