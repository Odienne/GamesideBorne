import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  BACKEND_SERVER_URL = "http://localhost/fusion/api/wizard/";

  constructor(private http: HttpClient) {
  }

  createTeams(data: any) {
    return this.http.post(this.BACKEND_SERVER_URL, data);
  }

  getMaxTeams() {
    return this.http.get(this.BACKEND_SERVER_URL + "?getMaxTeams");
  }
}
