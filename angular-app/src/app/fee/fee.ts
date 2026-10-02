import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeService } from '../fee.service';
import { StudentService } from '../student.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-fee',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './fee.html',
  styleUrl: './fee.css'
})

export class Fee {

  studentId = 0;
  amount = 0;
  paymentDate = '';
  paymentStatus = '';

  feeList: any[] = [];
  students: any[] = [];

  editingFeeId: number | null = null;

  constructor(
    private feeService: FeeService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFees();
    this.loadStudents();
  }

  loadStudents(): void {

    this.studentService.getStudents().subscribe({

      next: (data: any[]) => {

        this.students = data;

        this.cdr.detectChanges();

        console.log('Students loaded for fee:', data);
      },

      error: (error: any) => {

        console.error('Student API Error:', error);
      }

    });
  }

  getStudentName(studentId: number): string {

    const student = this.students.find(
      student => student.id === studentId
    );

    return student ? student.studentName : 'Unknown';
  }

  addFee(): void {

    if (this.studentId === 0) {

      alert('Please select a student.');

      return;
    }

    if (this.amount <= 0) {

      alert('Please enter a valid fee amount.');

      return;
    }

    if (!this.paymentDate) {

      alert('Please select payment date.');

      return;
    }

    if (!this.paymentStatus) {

      alert('Please select payment status.');

      return;
    }

    const fee = {

      studentId: this.studentId,
      amount: this.amount,
      paymentDate: this.paymentDate,
      paymentStatus: this.paymentStatus

    };

    if (this.editingFeeId !== null) {

      this.feeService
        .updateFee(this.editingFeeId, fee)
        .subscribe({

          next: () => {

            this.editingFeeId = null;

            this.clearForm();

            this.loadFees();

            alert('Fee updated successfully!');
          },

          error: (error: any) => {

            console.error('Update Error:', error);

            alert('Failed to update fee.');
          }

        });

    } else {

      this.feeService.addFee(fee).subscribe({

        next: () => {

          this.clearForm();

          this.loadFees();

          alert('Fee saved successfully!');
        },

        error: (error: any) => {

          console.error('Fee Save Error:', error);

          alert('Failed to save fee.');
        }

      });

    }
  }

  editFee(fee: any): void {

    this.editingFeeId = fee.id;

    this.studentId = fee.studentId;

    this.amount = fee.amount;

    this.paymentDate =
      fee.paymentDate.substring(0, 10);

    this.paymentStatus = fee.paymentStatus;
  }

  deleteFee(id: number): void {

    const confirmDelete = confirm(
      'Are you sure you want to delete this fee record?'
    );

    if (!confirmDelete) {
      return;
    }

    this.feeService.deleteFee(id).subscribe({

      next: () => {

        this.loadFees();

        alert('Fee deleted successfully!');
      },

      error: (error: any) => {

        console.error('Delete Error:', error);

        alert('Failed to delete fee.');
      }

    });
  }

  loadFees(): void {

    this.feeService.getFees().subscribe({

      next: (data: any[]) => {

        this.feeList = data;

        this.cdr.detectChanges();

        console.log('Fees refreshed:', data);
      },

      error: (error: any) => {

        console.error('Fee API Error:', error);
      }

    });
  }

  clearForm(): void {

    this.studentId = 0;
    this.amount = 0;
    this.paymentDate = '';
    this.paymentStatus = '';
  }
}