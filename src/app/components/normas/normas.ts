import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';
import * as AOS from 'aos';

@Component({
  selector: 'app-normas',
  standalone: true,
  imports: [Nav, Footer],
  templateUrl: './normas.html',
  styleUrls: ['./normas.css']
})
export class Normas implements AfterViewInit {

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }

  volverInicio() {
    this.router.navigate(['/home']);
  }
}
