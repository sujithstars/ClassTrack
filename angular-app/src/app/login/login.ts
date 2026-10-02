import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  private apiUrl = 'https://localhost:7133/api/Auth/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    const loginData = {
  username: this.username,
  password: this.password
};

    this.http.post<any>(this.apiUrl, loginData).subscribe({

      next: (response) => {

        localStorage.setItem('token', response.token);
alert('Token saved: ' + (localStorage.getItem('token') ? 'YES' : 'NO'));
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        alert('Login successful.');

        this.router.navigate(['/']);
      },

      error: (error) => {

        if (error.status === 401) {
          alert('Invalid username or password.');
        }
        else {
          alert('Login failed. Please try again.');
        }

      }

    });

  }
}