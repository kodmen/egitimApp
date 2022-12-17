import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementService } from 'app/admin/user-management/service/user-management.service';
import { User } from 'app/admin/user-management/user-management.model';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-hoca-olustur',
  templateUrl: './hoca-olustur.component.html',
  styleUrls: ['./hoca-olustur.component.scss']
})
export class HocaOlusturComponent implements OnInit {

  currentAccount: Account | null = null;
  users: User[] | null = null;
  isLoading = false;
  totalItems = 0;
 // itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  seacrhUser: User | null = null;

  search = this.fb.group({
    text: [],
  });

  constructor(
    private userService: UserManagementService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    console.log(this.currentAccount);
    
  }

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
  
}
