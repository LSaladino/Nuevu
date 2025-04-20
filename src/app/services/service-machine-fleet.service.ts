import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceMachineFleetService {
  // URL Principal
  UrlPrincipal: string = 'https://ng-demo-api.opten.io/api/machines';


  constructor(private http: HttpClient) { }

  // GET

  getAllMachines(): Observable<any> {
    return this.http.get(this.UrlPrincipal);
  }

  // GET by ID
  getMachineById(id: number) {
    return `${this.UrlPrincipal}/${id}`;
  }

  // POST
  // createMachine(machine: any, ): Observable<any> {
  //   return this.http.post<any>(`${this.UrlPrincipal}`, machine);
  // }

  createMachine(machine: any, HttpHeaders: any): Observable<any> {
    return this.http.post<any>(this.UrlPrincipal, machine, { headers: HttpHeaders });
  }


  // PUT
  updateMachine(machine: any): Observable<any> {
    return this.http.put(`${this.UrlPrincipal}/${machine.id}`, machine);
  }
  // DELETE
  deleteMachine(id: number): Observable<any> {
    return this.http.delete(`${this.UrlPrincipal}/${id}`);
  }

}