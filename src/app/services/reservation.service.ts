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


  detectTeamScan() {
    let deviceName = localStorage.getItem("deviceName");
    let finalURL = this.BACKEND_SERVER_URL + "?wizard_readTag&deviceName=" + deviceName;

    if (!deviceName) {
      alert("No device detected, can't register on this machine. Please head to your game master for help");
    }

    return this.http.get(finalURL);
  }

  createTeams(data: any) {
    return this.http.post(this.BACKEND_SERVER_URL, data);
  }

  getMaxTeams() {
    return this.http.get(this.BACKEND_SERVER_URL + "?getMaxTeams=1");
  }
}
