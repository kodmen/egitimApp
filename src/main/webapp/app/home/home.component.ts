import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Banner } from 'app/shared/banner/banner.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  banner: Banner;
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router) {
    this.banner = new Banner(
      'ca-pub-7102443455243908',
      2661258444,
      'auto',
        true
    )
//     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7102443455243908"
//      crossorigin="anonymous"></script>
// <!-- soru arası reklam -->
// <ins class="adsbygoogle"
//      style="display:block"
//      data-ad-client="ca-pub-7102443455243908"
//      data-ad-slot="2661258444"
//      data-ad-format="auto"
//      data-full-width-responsive="true"></ins>
// <script>
//      (adsbygoogle = window.adsbygoogle || []).push({});
// </script>
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
