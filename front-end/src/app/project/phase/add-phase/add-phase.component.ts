import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Phase } from '../model/phase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, MY_DATE_FORMATS } from '../../../utils/format-date';
import { errorEndDateMessage, errorMinDateMessage, newStatus } from 'src/app/project/utils/variables';
import { BadInput } from 'src/app/common/errors/bad-input';
import { matTooltipClose } from 'src/app/utils/variables';

@Component({
  selector: 'app-add-phase',
  templateUrl: './add-phase.component.html',
  styleUrls: ['./add-phase.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Change the locale if necessary
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AddPhaseComponent implements OnInit {

  phaseForm: FormGroup = Object.create(null);
  minStartDate: Date;
  minEndDate: Date;
  maxStartDate: any
  matTooltipClose = matTooltipClose

  constructor(private formBuilder: FormBuilder, private dataService: DataService,
    public dialogRef: MatDialogRef<AddPhaseComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public id: string) {
    this.minStartDate = new Date();
    this.minEndDate = new Date();
  }

  ngOnInit(): void {
    this.phaseForm = this.formBuilder.group(
      {
        title: null,
        description: [null, Validators.maxLength(120)],
        startDate: null,
        endDate: null,
        status: newStatus,
      });
  }

  submit() {
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (this.phaseForm.valid) {
      let phase = {
        title: this.phaseForm.value.title,
        description: this.phaseForm.value.description,
        startDate: this.phaseForm.value.startDate,
        endDate: this.phaseForm.value.endDate,
        status: this.phaseForm.value.status,
        projectId: this.id
      };
      // @ts-ignore
      this.dataService.postItem(new Phase(), '/add', phase)
        .pipe()
        .subscribe({
          next: (res) => {
            this.closeDialog()

            Toast.fire({
              icon: 'success',
              title: 'Phase Ajouté Avec Succès.',
              position: 'top-end',
            })
          },
          error: () => {
            Toast.fire({
              icon: 'error',
              text: BadInput.message,
              position: 'bottom',
              width: 450,
            })
          }
        })
    } else {
      // @ts-ignore
      Functions.validateOnSubmit(this.phaseForm);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  checkDate() {
    if (this.phaseForm.value.endDate != null)
      this.maxStartDate = this.phaseForm.value.endDate

    if (this.phaseForm.value.startDate != null)
      this.minEndDate = this.phaseForm.value.startDate
  }
}

