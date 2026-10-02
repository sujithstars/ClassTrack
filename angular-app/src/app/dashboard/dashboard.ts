import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../student.service';
import { TeacherService } from '../teacher.service';
import { AttendanceService } from '../attendance';
import { FeeService } from '../fee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalStudents = 0;
  totalTeacher = 0;
  presentToday = 0;
  feesCollected = 0;

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private attendanceService: AttendanceService,
    private feeService: FeeService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.totalStudents = students.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });

    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.totalTeacher = teachers.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
      }
    });

    this.attendanceService.getAttendance().subscribe({
      next: (attendance) => {

        const today = new Date().toISOString().split('T')[0];

        this.presentToday = attendance.filter(a =>
          a.attendanceDate?.startsWith(today) &&
          a.status?.toLowerCase() === 'present'
        ).length;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
      }
    });

    this.feeService.getFees().subscribe({
      next: (fees) => {

        this.feesCollected = fees.reduce(
          (total, fee) => total + Number(fee.amount),
          0
        );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading fees:', error);
      }
    });
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}