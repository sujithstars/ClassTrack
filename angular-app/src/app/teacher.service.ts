import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = 'https://localhost:7133/api/Teacher';

  constructor(private http: HttpClient) {}

  getTeachers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTeacher(teacher: any) {
    return this.http.post<any>(this.apiUrl, teacher);
  }

  updateTeacher(id: number, teacher: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, teacher);
  }

  deleteTeacher(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}