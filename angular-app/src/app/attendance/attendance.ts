import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../attendance';
import { Component, ChangeDetectorRef } from '@angular/core';
import { StudentService } from '../student.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe,RouterLink],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})

export class Attendance {

  studentId = 0;
  attendanceDate = '';
  status = '';

  students: any[] = [];

  attendanceList: any[] = [];

  editingAttendanceId: number | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAttendance();
    this.loadStudents();
  }

  loadStudents() {

    this.studentService.getStudents().subscribe({

      next: (data) => {

        this.students = data;

        this.cdr.detectChanges();

        console.log('Students loaded for attendance:', data);
      },

      error: (error) => {

        console.error('Student API Error:', error);
      }

    });
  }

  addAttendance() {

    const attendance = {
      studentId: this.studentId,
      attendanceDate: this.attendanceDate,
      status: this.status
    };

    if (this.editingAttendanceId !== null) {

      this.attendanceService
        .updateAttendance(this.editingAttendanceId, attendance)
        .subscribe({

          next: (response) => {

            console.log('Attendance updated:', response);

            this.loadAttendance();

            alert('Attendance updated successfully!');

            this.editingAttendanceId = null;

            this.clearForm();
          },

          error: (error) => {

            console.error('Update Error:', error);

            alert('Failed to update attendance.');
          }

        });

    }

    else {

      this.attendanceService.addAttendance(attendance).subscribe({

        next: (response) => {

          console.log('Attendance saved:', response);

          this.loadAttendance();

          alert('Attendance saved successfully!');

          this.clearForm();
        },

        error: (error) => {

          console.error('Attendance Save Error:', error);

          alert('Failed to save attendance.');
        }

      });
    }
  }

  editAttendance(attendance: any) {

    this.editingAttendanceId = attendance.id;

    this.studentId = attendance.studentId;

    this.attendanceDate =
      attendance.attendanceDate.substring(0, 10);

    this.status = attendance.status;
  }

  deleteAttendance(id: number) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this attendance record?'
    );

    if (!confirmDelete) {
      return;
    }

    this.attendanceService.deleteAttendance(id).subscribe({

      next: () => {

        this.loadAttendance();

        alert('Attendance deleted successfully!');
      },

      error: (error) => {

        console.error('Delete Error:', error);

        alert('Failed to delete attendance.');
      }

    });
  }

  loadAttendance() {

    this.attendanceService.getAttendance().subscribe({

      next: (data) => {

        this.attendanceList = data;

        this.cdr.detectChanges();

        console.log('Attendance refreshed:', data);
      },

      error: (error) => {

        console.error('Attendance API Error:', error);
      }

    });
  }

  getStudentName(studentId: number): string {

    const student = this.students.find(
      student => student.id === studentId
    );

    return student ? student.studentName : 'Unknown Student';
  }

  clearForm() {

    this.studentId = 0;
    this.attendanceDate = '';
    this.status = '';
  }
}