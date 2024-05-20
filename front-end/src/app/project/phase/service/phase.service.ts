import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class PhaseService {
 /* private idSource = new BehaviorSubject<any>('');
  phaseId = this.idSource.asObservable()*/
  private selectedPhaseId: any;

  constructor() { }
 /* changePhaseId(phaseId: number) {
    this.idSource.next(phaseId);
  }*/

  get id(): number {
    return this.selectedPhaseId;
  }

  set id(id: number) {
    this.selectedPhaseId = id;
  }
}
