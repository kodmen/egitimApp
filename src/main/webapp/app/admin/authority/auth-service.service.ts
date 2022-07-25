import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { IAuthorty } from './authorty.model';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  private resourceAuthUrl = this.applicationConfigService.getEndpointFor('api/admin/auth');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getAuth():Observable<IAuthorty[]>{
    return this.http.get<IAuthorty[]>(this.resourceAuthUrl);
  }

  createAuth(auth:IAuthorty):Observable<IAuthorty>{
    return this.http.post<IAuthorty>(this.resourceAuthUrl,auth);
  }

  delete(auth?:string):Observable<HttpResponse<{}>>{
    return this.http.delete(this.resourceAuthUrl+`/${auth}`, {  observe: 'response' });
  }
}
