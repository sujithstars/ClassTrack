import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../student.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students {

  studentName = '';
  parentName = '';
  mobile = '';
  selectedClass = '';

  students: any[] = [];
  editingStudentId: number | null = null;

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  addStudent() {

    if (!this.studentName.trim()) {
      alert('Please enter student name.');
      return;
    }

    if (!this.parentName.trim()) {
      alert('Please enter parent name.');
      return;
    }

    if (!/^[0-9]{10}$/.test(this.mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!this.selectedClass) {
      alert('Please select a class.');
      return;
    }

    const student = {
      studentName: this.studentName.trim(),
      parentName: this.parentName.trim(),
      mobile: this.mobile.trim(),
      class: this.selectedClass
    };

    if (this.editingStudentId !== null) {

      this.studentService
        .updateStudent(this.editingStudentId, student)
        .subscribe({
          next: () => {
            this.loadStudents();
            alert('Student updated successfully!');
            this.editingStudentId = null;
            this.clearForm();
          },
          error: () => {
            alert('Failed to update student.');
          }
        });

    } else {

      this.studentService.addStudent(student).subscribe({
        next: () => {
          this.loadStudents();
          alert('Student saved successfully!');
          this.clearForm();
        },
        error: () => {
          alert('Failed to save student.');
        }
      });

    }
  }

  editStudent(student: any) {

    this.editingStudentId = student.id;
    this.studentName = student.studentName;
    this.parentName = student.parentName;
    this.mobile = student.mobile;
    this.selectedClass = student.class;
  }

  deleteStudent(id: number) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmDelete) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.students = this.students.filter(
          student => student.id !== id
        );

        this.cdr.detectChanges();

        alert('Student deleted successfully!');
      },
      error: () => {
        alert('Failed to delete student.');
      }
    });
  }

  loadStudents() {

    this.studentService.getStudents().subscribe({
      next: (data) => {

        this.students = data;

        this.cdr.detectChanges();

        console.log('Students received:', this.students);
      },
      error: (error) => {

        console.error('API Error:', error);
        alert('Failed to load students.');
      }
    });
  }

  clearForm() {

    this.studentName = '';
    this.parentName = '';
    this.mobile = '';
    this.selectedClass = '';
  }
}