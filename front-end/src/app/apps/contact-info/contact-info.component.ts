import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { User } from '../../core/user/model/user'
import { profilUserCard } from '../../core/utils/variables';
import { matTooltipClose } from 'src/app/utils/variables';


@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  profilUserCard = profilUserCard
  matTooltipClose = matTooltipClose

  constructor(
    public dialogRef: MatDialogRef<ContactInfoComponent>,
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
