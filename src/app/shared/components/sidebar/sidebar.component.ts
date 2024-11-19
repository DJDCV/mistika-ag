import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  clientName: string = ""
  clientEmail: string = ""


  constructor(private authService: AuthService) {}

  getClientInfo(): void {
    const clientData = this.authService.getClientNameEmailFromToken();
    if (clientData) {
      this.clientName = clientData.name || "Nombre no disponible";
      this.clientEmail = clientData.email || "Email no disponible";
    } else {
      this.clientName = "No auth";
      this.clientEmail = "No disponible";
    }
  }
  
  ngOnInit(): void {
      this.getClientInfo();
  }

}
