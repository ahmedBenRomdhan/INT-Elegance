import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'confirm-popUp',
    templateUrl: './confirm-popUp.component.html'
})
export class ConfirmPopUpComponent implements OnInit {

    // @ts-ignore
  public confirmMessage: string;
  // @ts-ignore
    public titleMessage: string;
  // @ts-ignore
    public subConfirmMessage: string;
    public comment = false;
  // @ts-ignore
    @ViewChild('commentForm',  {static: false}) commentForm: NgForm;
    constructor(public dialogRef: MatDialogRef<ConfirmPopUpComponent>) {}

    ngOnInit() {

    }

}
