import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDenemeAnalizSinif } from '../deneme-analiz-sinif.model';
import { DenemeAnalizSinifService } from '../service/deneme-analiz-sinif.service';
import { DenemeAnalizSinifDeleteDialogComponent } from '../delete/deneme-analiz-sinif-delete-dialog.component';
import { ISinif } from 'app/entities/sinif/sinif.model';
import { SinifService } from 'app/entities/sinif/service/sinif.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder } from '@angular/forms';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-deneme-analiz-sinif',
  templateUrl: './deneme-analiz-sinif.component.html',
})
export class DenemeAnalizSinifComponent implements OnInit {
  denemeAnalizSinifs?: IDenemeAnalizSinif[];
  isLoading = false;

  siniflar?: ISinif[] = [];
  seciliSinif?: ISinif;
  // dropdownList:any[] = [];
  dropdownSettings: IDropdownSettings;
  account: Account | null = null;

  sinifSec = this.fb.group({
    sinif: [],
  });

  constructor(
    private accountService: AccountService,
    protected sinifService: SinifService,
    protected denemeAnalizSinifService: DenemeAnalizSinifService,
    protected modalService: NgbModal,
    protected fb: FormBuilder
  ) {}
  sinifGetir(any: any): void {
    if (this.seciliSinif !== any) {
      this.seciliSinif = any;
      console.log('sinif değişti');
      this.denemeAnalizSinifService.query({ sinifId: this.seciliSinif?.id }).subscribe({
        next: (res: HttpResponse<IDenemeAnalizSinif[]>) => {
          this.isLoading = false;
          this.denemeAnalizSinifs = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
    // sınıf değişince eğer secili
  }
  loadAll(): void {
    this.isLoading = true;

    this.sinifService.query().subscribe({
      next: (res: HttpResponse<ISinif[]>) => {
        this.isLoading = false;
        this.siniflar = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });

    if (this.account?.authorities.includes('ROLE_ADMIN')) {
      this.denemeAnalizSinifService.query().subscribe({
        next: (res: HttpResponse<IDenemeAnalizSinif[]>) => {
          this.isLoading = false;
          this.denemeAnalizSinifs = res.body ?? [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  ngOnInit(): void {
      this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    this.loadAll();

  

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'isim',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };
  }

  trackId(_index: number, item: IDenemeAnalizSinif): number {
    return item.id!;
  }

  delete(denemeAnalizSinif: IDenemeAnalizSinif): void {
    const modalRef = this.modalService.open(DenemeAnalizSinifDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.denemeAnalizSinif = denemeAnalizSinif;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
