import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../teacher';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class Teacher {

  teacherName = '';
  mobile = '';
  subject = '';

  teachers: any[] = [];

  editingTeacherId: number | null = null;

  constructor(
    private teacherService: TeacherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTeachers();
  }

  addTeacher() {

    if (!this.teacherName.trim()) {
      alert('Please enter teacher name.');
      return;
    }

    if (!this.mobile.trim()) {
      alert('Please enter mobile number.');
      return;
    }

    if (!/^[0-9]{10}$/.test(this.mobile.trim())) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    if (!this.subject.trim()) {
      alert('Please enter subject.');
      return;
    }

    const teacher = {
      teacherName: this.teacherName.trim(),
      mobile: this.mobile.trim(),
      subject: this.subject.trim()
    };

    if (this.editingTeacherId !== null) {

      this.teacherService
        .updateTeacher(this.editingTeacherId, teacher)
        .subscribe({
          next: (response) => {

            console.log('Teacher updated:', response);

            this.loadTeachers();

            alert('Teacher updated successfully!');

            this.editingTeacherId = null;

            this.clearForm();
          },
          error: (error) => {

            console.error('Update Error:', error);

            alert('Failed to update teacher.');
          }
        });

    } else {

      this.teacherService.addTeacher(teacher).subscribe({
        next: (response) => {

          console.log('Teacher saved:', response);

          this.loadTeachers();

          alert('Teacher saved successfully!');

          this.clearForm();
        },
        error: (error) => {

          console.error('Teacher Save Error:', error);

          alert('Failed to save teacher.');
        }
      });
    }
  }

  editTeacher(teacher: any) {

    this.editingTeacherId = teacher.id;

    this.teacherName = teacher.teacherName;
    this.mobile = teacher.mobile;
    this.subject = teacher.subject;
  }

  deleteTeacher(id: number) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this teacher?'
    );

    if (!confirmDelete) {
      return;
    }

    this.teacherService.deleteTeacher(id).subscribe({

      next: () => {

        this.loadTeachers();

        console.log('Teacher deleted:', id);

        alert('Teacher deleted successfully!');
      },

      error: (error) => {

        console.error('Delete Error:', error);

        alert('Failed to delete teacher.');
      }
    });
  }

  loadTeachers() {

    this.teacherService.getTeachers().subscribe({

      next: (data) => {

        this.teachers = data;

        this.cdr.detectChanges();

        console.log('Teachers refreshed:', data);
      },

      error: (error) => {

        console.error('Teacher API Error:', error);

        alert('Failed to load teachers.');
      }
    });
  }

  clearForm() {

    this.teacherName = '';
    this.mobile = '';
    this.subject = '';
  }
}