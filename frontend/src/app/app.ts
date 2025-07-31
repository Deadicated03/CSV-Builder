import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout';
 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'CSVbuilder';
}
