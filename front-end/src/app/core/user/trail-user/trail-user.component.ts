import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Trail } from 'src/app/models/trail';
import { DataService } from 'src/app/services/data.service';
import { historyCard, noDataFound } from 'src/app/utils/variables';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trail-user',
  templateUrl: './trail-user.component.html',
  styleUrls: ['./trail-user.component.scss']
})
export class TrailUserComponent implements OnInit {

  historyCard = historyCard
  trailUsersList: Trail[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource = new MatTableDataSource<Trail>();

  noData = noDataFound
  userId: any
  constructor(private dataService: DataService,
              private changeDetectorRef: ChangeDetectorRef,
              ) {
  }

  ngOnInit(): void {
    this.getTrailUserssList()
    this.changeDetectorRef.detectChanges();
  }

  getTrailUserssList() {
    //@ts-ignore
    this.dataService.getCollection(new Trail(), '/users')
      .pipe()
      .subscribe((result) => {
        if (result) {
          this.trailUsersList = result
          for (let i = 0; i < result.length; i++) {
            this.trailUsersList[i].attributes = JSON.parse(this.trailUsersList[i].attributes)
            this.trailUsersList[i].newValues = JSON.parse(this.trailUsersList[i].newValues)
            this.trailUsersList[i].oldValues = JSON.parse(this.trailUsersList[i].oldValues)
          }
          this.dataSource = new MatTableDataSource(this.trailUsersList);
          this.dataSource.paginator = this.paginator;
          this.obs = this.dataSource.connect();
        }
      })
  }

}
