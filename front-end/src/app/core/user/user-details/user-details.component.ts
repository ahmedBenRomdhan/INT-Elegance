import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { User } from '../model/user';
import { profilUserCard } from '../../utils/variables';
import { matTooltipClose } from 'src/app/utils/variables';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  profilUserCard = profilUserCard
  matTooltipClose = matTooltipClose
  constructor(
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    private dataService: DataService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
