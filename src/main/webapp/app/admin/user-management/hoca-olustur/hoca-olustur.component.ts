import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserManagementService } from '../service/user-management.service';
import { User } from '../user-management.model';

@Component({
  selector: 'jhi-hoca-olustur',
  templateUrl: './hoca-olustur.component.html',
  styleUrls: ['./hoca-olustur.component.scss'],
})
export class HocaOlusturComponent implements OnInit {
  search = this.fb.group({
    text: [],
  });
  currentAccount: Account | null = null;

  seacrhUser: User | null = null;

  isLoading = false;
  totalItems = 0;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  constructor(private userService: UserManagementService, private fb: FormBuilder, private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,) {}

  searchText(): void {
    const seacrh = this.search.get(['text'])!.value;
    this.userService.seacrh(seacrh).subscribe(res => {
      if (res.body) {
        this.seacrhUser = res.body;
      }
    });
  }

  setActive(user: User, isActivated: boolean): void {
    this.userService.update({ ...user, activated: isActivated }).subscribe(() => this.loadAll());
  }

  loadAll(): void {
    this.isLoading = true;
    // this.userService
    //   .query({
    //     page: this.page - 1,
    //     size: this.itemsPerPage,
    //     sort: this.sort(),
    //   })
    //   .subscribe({
    //     next: (res: HttpResponse<User[]>) => {
    //       this.isLoading = false;
    //       this.onSuccess(res.body, res.headers);
    //     },
    //     error: () => (this.isLoading = false),
    //   });

      this.seacrhUser = null;
  }


  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
  }
}
