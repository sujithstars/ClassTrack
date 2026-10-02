import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'https://localhost:7133/api/Attendance';

  constructor(private http: HttpClient) {}

  getAttendance() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addAttendance(attendance: any) {
    return this.http.post<any>(this.apiUrl, attendance);
  }

  updateAttendance(id: number, attendance: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, attendance);
  }

  deleteAttendance(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}