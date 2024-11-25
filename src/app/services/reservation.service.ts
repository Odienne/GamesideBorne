import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  BACKEND_SERVER_URL = "localhost:8000/";

  constructor(private http: HttpClient) { }

  createTeams(data: any) {
    //send data to backend hello.php
    this.http.post(this.BACKEND_SERVER_URL, data);
  }
}
