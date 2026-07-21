import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'mss-public-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {}
