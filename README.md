# 📊 FinanciApp - Aplicación de Finanzas Personales

Una aplicación web moderna para la gestión de finanzas personales desarrollada con Angular 19, siguiendo principios de Clean Architecture.

## 🚀 Características

- **Autenticación Segura**: Sistema completo de login/registro con JWT tokens
- **Gestión de Presupuestos**: Crear y administrar presupuestos personalizados
- **Control de Ingresos**: Registrar y categorizar ingresos
- **Seguimiento de Gastos**: Monitorear gastos por categorías
- **Reportes Financieros**: Visualizar el estado financiero
- **Interfaz Moderna**: Diseño responsive con PrimeNG y Tailwind CSS
- **Arquitectura Limpia**: Separación clara de responsabilidades

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 19** - Framework principal
- **TypeScript 5.6.2** - Lenguaje de programación
- **PrimeNG 19.1.4** - Componentes UI
- **Tailwind CSS 4.1.11** - Framework CSS
- **RxJS 7.8.0** - Programación reactiva
- **SweetAlert2 11.22.2** - Alertas y notificaciones
- **Animate.css 4.1.1** - Animaciones

### Herramientas de Desarrollo
- **Angular CLI 19.0.2** - Herramientas de línea de comandos
- **Karma & Jasmine** - Testing framework
- **PostCSS 8.5.6** - Procesamiento CSS

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── guard/              # Guards de autenticación
│   │   ├── interceptors/       # Interceptores HTTP
│   │   ├── interfaces/         # Interfaces TypeScript
│   │   ├── layout/             # Layout de autenticación
│   │   ├── pages/              # Páginas de login/registro
│   │   ├── services/           # Servicios de auth
│   │   └── validators/         # Validadores personalizados
│   ├── dashboard/              # Módulo principal
│   │   ├── components/         # Componentes reutilizables
│   │   ├── interfaces/         # Interfaces del dashboard
│   │   ├── layout/             # Layout del dashboard
│   │   ├── pages/              # Páginas principales
│   │   └── services/           # Servicios del dashboard
│   ├── shared/                 # Componentes compartidos
│   │   ├── components/         # Componentes globales
│   │   ├── PrimeNg/           # Configuración PrimeNG
│   │   └── services/          # Servicios compartidos
│   └── user/                  # Módulo de usuario
├── assets/                    # Recursos estáticos
│   ├── icons/                # Iconos de la aplicación
│   └── img/                  # Imágenes
└── environment/              # Configuraciones de entorno
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Angular CLI** (se instala automáticamente)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd FrontEnd
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear o modificar `src/environment/environmet.ts`:
   ```typescript
   export const env = {
     BASE_URL: '', // URL de tu backend
   };
   ```

4. **Ejecutar el servidor de desarrollo**
   ```bash
   npm start
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:4200
   ```

## 🔧 Scripts Disponibles

```bash
# Servidor de desarrollo
npm start

# Construir para producción
npm run build

# Construir en modo watch
npm run watch

# Ejecutar tests
npm test

# Comando Angular CLI
npm run ng
```

## 🔐 Sistema de Autenticación

### Características
- **JWT Tokens**: Access token y refresh token
- **Renovación Automática**: Tokens se renuevan automáticamente
- **Guards de Ruta**: Protección de rutas autenticadas
- **Interceptores HTTP**: Manejo automático de tokens en peticiones
- **Persistencia**: Tokens almacenados en localStorage

### Endpoints Utilizados
- `POST /user/login` - Inicio de sesión
- `POST /user/register` - Registro de usuario
- `POST /user/refresh-token` - Renovación de token
- `GET /user/GetByEmail/{email}` - Verificación de email

### Flujo de Autenticación
1. Usuario hace login/registro
2. Se almacenan access token y refresh token
3. Interceptor agrega automáticamente Bearer token a peticiones
4. Si token expira, se renueva automáticamente
5. Si refresh falla, usuario es deslogueado

## 📊 Funcionalidades del Dashboard

### Módulos Principales
- **Bienvenida**: Página de inicio con resumen
- **Presupuesto**: Gestión de presupuestos
- **Ingresos**: Registro y categorización de ingresos
- **Gastos**: Control y seguimiento de gastos
- **Reportes**: Visualización de datos financieros
- **Configuración**: Ajustes del usuario

### Componentes Reutilizables
- **Dialog Form**: Formularios modales reutilizables
- **History Table**: Tabla para historiales
- **Profile Card**: Tarjeta de perfil de usuario
- **Header & Sidebar**: Navegación principal

## 🎨 UI/UX

### Framework de Componentes
- **PrimeNG**: Componentes UI profesionales
- **Tema Aura**: Tema moderno y accesible
- **Iconos PrimeIcons**: Iconografía consistente

### Estilos
- **Tailwind CSS**: Framework CSS utility-first
- **Fuente Inria Sans**: Tipografía moderna
- **Animaciones**: Transiciones suaves con Animate.css
- **Responsive**: Diseño adaptable a todos los dispositivos

## 🔧 Configuración de Desarrollo

### Estructura de Rutas
```typescript
// Rutas principales
/auth/login          # Página de login
/auth/register       # Página de registro
/dashboard           # Dashboard principal
/dashboard/welcome   # Página de bienvenida
/dashboard/budget    # Gestión de presupuestos
/dashboard/incomes   # Gestión de ingresos
/dashboard/spends    # Gestión de gastos
/dashboard/reports   # Reportes financieros
/dashboard/settings  # Configuración
```

### Guards de Autenticación
- **AuthGuard**: Protege rutas que requieren autenticación
- **NoAuthGuard**: Impide acceso a login/registro si ya está autenticado

### Interceptores
- **AuthInterceptor**: Maneja automáticamente tokens JWT en peticiones HTTP

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Pantallas grandes (1200px+)
- **Tablet**: Dispositivos medianos (768px - 1199px)
- **Mobile**: Dispositivos móviles (< 768px)

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test -- --code-coverage
```

## 🚀 Despliegue

### Construcción para Producción
```bash
npm run build
```

### Configuración de Producción
Modificar `src/environment/environment.pro.ts`:
```typescript
export const env = {
  BASE_URL: 'https://tu-api-produccion.com/api',
};
```

## 📋 TODO Pendiente

### Funcionalidades por Implementar
- [ ] Formularios de ingreso/edición de gastos e ingresos
- [ ] Tablas de historial completas
- [ ] Componente de action-bar para tablas
- [ ] Servicios CRUD completos para presupuestos
- [ ] Implementación de Http-Only cookies para tokens
- [ ] Reportes financieros avanzados

### Mejoras Técnicas
- [ ] Optimización de performance
- [ ] Implementación de PWA
- [ ] Tests unitarios completos
- [ ] Documentación de API

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- Angular Team por el excelente framework
- PrimeNG por los componentes UI
- Tailwind CSS por el framework de estilos
- Comunidad de desarrolladores Angular

---

**Nota**: Esta aplicación requiere un backend compatible con la API especificada. Asegúrate de tener el backend ejecutándose en `https://localhost:7051/api` para el desarrollo local.
