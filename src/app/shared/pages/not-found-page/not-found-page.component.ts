import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  template: `
    <!-- not-found.component.html -->
    <div
      class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-lg w-full space-y-8 text-center">
        <!-- Número 404 animado -->
        <div class="relative">
          <h1
            class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 animate-pulse"
          >
            404
          </h1>
          <!-- Efecto de resplandor -->
          <div
            class="absolute inset-0 text-9xl font-bold text-gray-600 opacity-20 blur-sm animate-pulse"
          >
            404
          </div>
        </div>

        <!-- Icono y mensaje principal -->
        <div class="space-y-6">
          <!-- Mensaje principal -->
          <div class="space-y-4">
            <h2 class="text-3xl font-bold text-white sm:text-4xl">
              ¡Oops! Página no encontrada
            </h2>
            <p class="text-lg text-gray-400 max-w-md mx-auto">
              Lo sentimos, la página que estás buscando no existe o ha sido
              movida a otra ubicación.
            </p>
          </div>

          <!-- Sugerencias -->
          <div
            class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h3 class="text-xl font-semibold text-white mb-4">
              ¿Qué puedes hacer?
            </h3>
            <div class="space-y-3 text-gray-300">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Verifica que la URL esté escrita correctamente</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>Regresa a la página principal</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span>Usa el botón de búsqueda</span>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              (click)="goHome()"
              class="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-600"
            >
              <svg
                class="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Ir al inicio
            </button>

            <button
            (click)="goBack()"
              class="px-8 py-3 bg-gray-800/60 backdrop-blur-sm text-gray-300 font-semibold rounded-xl border border-gray-600/50 hover:bg-gray-700/60 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <svg
                class="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver atrás
            </button>
          </div>
        </div>

        <!-- Elementos decorativos flotantes -->
        <div
          class="absolute top-20 left-10 w-20 h-20 bg-gray-700/20 rounded-full blur-xl animate-bounce"
        ></div>
        <div
          class="absolute bottom-20 right-10 w-16 h-16 bg-gray-600/20 rounded-full blur-xl animate-bounce"
          style="animation-delay: 1s;"
        ></div>
        <div
          class="absolute top-1/2 left-20 w-12 h-12 bg-gray-500/20 rounded-full blur-xl animate-bounce"
          style="animation-delay: 2s;"
        ></div>
      </div>
    </div>
  `,

  styles: [],
})
export default class NotFoundPageComponent {
  private readonly router: Router = inject(Router);


  goHome(): void {
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {

    this.router.navigate(['']);

  }
}
