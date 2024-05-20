import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-project',
  templateUrl: './details-project.component.html',
  styleUrls: ['./details-project.component.scss']
})
export class DetailsProjectComponent implements OnInit {
  id : string | null = '';

  constructor(    private activated : ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.id = this.activated.snapshot.paramMap.get('id');
  }

}
