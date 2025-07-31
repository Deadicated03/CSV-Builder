import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {

    constructor(private router: Router) {}

  goToUpload(): void {
    this.router.navigate(['/upload']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToBuildCsv(): void {
    this.router.navigate(['/json/upload']);
  }

  goToNoCodeTemplate(): void {
    this.router.navigate(['/no-code-template']);
  }

}
