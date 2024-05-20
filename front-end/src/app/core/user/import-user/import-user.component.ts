import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { User } from '../model/user';
import { errorNoFileMessage, errorTypeFileMessage, importFileMessage, importUserCard, legendFile, templateFile } from '../../utils/variables';
import { importButton, cancelButton, matTooltipClose } from 'src/app/utils/variables';

@Component({
  selector: 'app-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: ['./import-user.component.scss']
})
export class ImportUserComponent implements OnInit {

  file: any
  errorTypeMessage = errorTypeFileMessage;
  errorMessage = errorNoFileMessage;
  noFileError = false;
  fileError = false;
  isLoading = false;
  legend = legendFile
  template = templateFile
  matTooltipClose = matTooltipClose

  importUserCard = importUserCard
  importButton = importButton
  cancelButton = cancelButton
  imagePreview: any = './assets/images/excel.png';

  constructor(public dialogRef: MatDialogRef<ImportUserComponent>, public dataService: DataService) { }

  ngOnInit(): void { }

  onFileChange(files: FileList): void {
    this.file = files.item(0);
    this.noFileError = false

    if (this.file) {
      const fileType = this.file.type;
      if (fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        fileType !== 'application/vnd.ms-excel' && fileType !== 'text/csv') {
        this.fileError = true;
      } else {
        this.fileError = false;
      }
    }
  }

  onSubmit() {
    if (!this.file)
      this.noFileError = true
    else {
      this.isLoading = true;
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
      const formData = new FormData();
      formData.append('file', this.file);


      // @ts-ignore
      this.dataService.postItemFD(new User(), '/importFile', formData)
        .pipe()
        .subscribe((response) => {
          this.isLoading = false;
          this.closeDialog();
          Toast.fire({
            icon: 'warning',
            title: importFileMessage + response.body,
            position: 'top',
            width: 450,
          })
        })
    }
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  downloadFile() { 
    const filename = 'template.xlsx';
    const templatePath = 'assets/files/template.xlsx';

    // Create an anchor element
    const link = document.createElement('a');
    link.href = templatePath;
    link.download = filename;

    // Append the link to the document and click it programmatically
    document.body.appendChild(link);
    link.click();

    // Clean up the link
    document.body.removeChild(link);
  }
}