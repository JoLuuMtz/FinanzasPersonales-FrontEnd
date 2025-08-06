import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-token-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showTokenInfo()" class="token-info">
      <h4>Información del Token</h4>
      <div class="token-details">
        <p>
          <strong>Autenticado:</strong>
          {{ tokenInfo().isAuthenticated ? 'Sí' : 'No' }}
        </p>
        <p *ngIf="tokenInfo().timeRemaining !== null">
          <strong>Tiempo restante:</strong>
          {{ tokenInfo().timeRemaining }} minutos
        </p>
        <p *ngIf="tokenInfo().isExpiringSoon" class="warning">
          ⚠️ Token expira pronto
        </p>
        <button (click)="refreshToken()" class="refresh-btn">
          Refrescar Token Manualmente
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .token-info {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        border: 1px solid #ddd;
      }

      .token-details {
        font-size: 14px;
      }

      .warning {
        color: #ff6b35;
        font-weight: bold;
      }

      .refresh-btn {
        background: #4caf50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }

      .refresh-btn:hover {
        background: #45a049;
      }
    `,
  ],
})
export class TokenInfoComponent {
  private authService = inject(AuthService);

  public tokenInfo = signal(this.authService.getTokenInfo());
  public showTokenInfo = signal(false);

  constructor() {
    // Actualizar información del token cada 30 segundos
    interval(30000).subscribe(() => {
      this.tokenInfo.set(this.authService.getTokenInfo());
    });

    // Mostrar información solo si está autenticado
    this.authService.IsAutenticated.subscribe((isAuthenticated) => {
      this.showTokenInfo.set(isAuthenticated);
    });
  }

  refreshToken(): void {
    this.authService.refreshAccessToken().subscribe({
      next: (response) => {
        console.log('Token refrescado manualmente');
        this.tokenInfo.set(this.authService.getTokenInfo());
      },
      error: (error) => {
        console.error('Error al refrescar token:', error);
      },
    });
  }
}
