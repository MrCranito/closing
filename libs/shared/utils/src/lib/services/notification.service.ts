import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService);

  add(message: string, status: string) {
    this.messageService.add({
      severity: status,
      summary: message,
    });
  }
}
