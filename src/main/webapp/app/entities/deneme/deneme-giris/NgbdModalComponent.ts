import { Component, EventEmitter, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'jhi-ngbd-modal-content',
    template: `
      <div class="modal-header">
        <h4 class="modal-title">Dikkat!</h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
      </div>
      <div class="modal-body">
        <p>Testi bitirmek istediğine emin misin!</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
        <button type="submit" class="btn btn-outline-danger" (click)="passBack()">Testi tamamla</button>
  
      </div>
    `
  })
  export class NgbdModalComponent {
      @Output() passEntry: EventEmitter<any> = new EventEmitter();
  
    constructor(public activeModal: NgbActiveModal) {}
  
    
    passBack():void {
      this.passEntry.emit("tamamla");
      }
  
  }
  
  