import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBotComponent } from '../chat-bot/chat-bot';
import { ScrollTopComponent } from '../../scroll-top/scroll-top';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-actions',
  standalone: true,
  imports: [CommonModule, ChatBotComponent, ScrollTopComponent],
  templateUrl: './floating-actions.html',
  styleUrls: ['./floating-actions.css'],
})
export class FloatingActionsComponent { 

  rutasSinFloating = [
    '/login',
    '/register',
    '/recuperar-password'
  ];

  constructor(public router: Router) {}
}