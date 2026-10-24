import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = `${environment.apiUrl}/Student`;

  constructor(private http: HttpClient) {}

  getStudents() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addStudent(student: any) {
    return this.http.post<any>(this.apiUrl, student);
  }

  deleteStudent(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateStudent(id: number, student: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, student);
  }
}