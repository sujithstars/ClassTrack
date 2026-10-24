import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  private apiUrl = `${environment.apiUrl}/Fee`;

  constructor(private http: HttpClient) {}

  getFees() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addFee(fee: any) {
    return this.http.post<any>(this.apiUrl, fee);
  }

  updateFee(id: number, fee: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, fee);
  }

  deleteFee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}