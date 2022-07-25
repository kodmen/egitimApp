import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'app/core/util/alert.service';
import { UserService } from 'app/entities/user/user.service';
import { AuthServiceService } from './auth-service.service';
import { Authorty, IAuthorty } from './authorty.model';

@Component({
  selector: 'jhi-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss'],
})
export class AuthorityComponent implements OnInit {
  auth?: IAuthorty[];
  isSaving = false;

  editForm = this.fb.group({
    name: [null, [Validators.required]],
  });
  constructor(
    private authService: AuthServiceService,
    private userService: UserService,
    protected fb: FormBuilder,
    protected alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getAllAuth();
  }

  getAllAuth(): void {
    this.authService.getAuth().subscribe(res => {
      console.log('auth getirdi');

      console.log(res);
      this.auth = res;
    });
  }

  save(): void {
    this.isSaving = true;
    const auth = new Authorty(this.editForm.get(['name'])!.value);

    this.authService.createAuth(auth).subscribe(res => {
      console.log('başarılı');
      console.log(res);
      this.alertService.addAlert({ type: 'success', message: `başarıyla eklendi ${res.name} ` });
    });
  }

  delete(auth?: IAuthorty): void {
    
      this.authService.delete(auth?.name).subscribe(res => {
        console.log('sildi');
        console.log(res);
      });
    
  }
}
