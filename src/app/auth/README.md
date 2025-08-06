# Sistema de Refresh Token

## Descripción

Este sistema implementa un mecanismo completo de refresh token para mantener la autenticación del usuario de forma segura y transparente.

## Componentes Implementados

### 1. Interfaces
- `RefreshTokenResponse`: Define la estructura de respuesta del endpoint de refresh
- `RefreshTokenDTO`: Define la estructura de datos enviados al endpoint

### 2. AuthService
- **Propiedades agregadas:**
  - `refreshToken`: Signal para almacenar el refresh token
  - Métodos para manejo de tokens

- **Métodos nuevos:**
  - `refreshAccessToken()`: Renueva el access token usando el refresh token
  - `updateTokens()`: Actualiza ambos tokens en el servicio
  - `isTokenExpiringSoon()`: Verifica si el token expira pronto
  - `getTokenTimeRemaining()`: Obtiene el tiempo restante del token

### 3. AuthInterceptor
- Interceptor HTTP que maneja automáticamente los errores 401
- Renueva automáticamente el token cuando expira
- Evita múltiples llamadas simultáneas al endpoint de refresh
- Maneja la cola de peticiones durante el refresh

### 4. Funcionalidad de Monitoreo Automático (integrada en AuthService)
- Monitoreo automático de la expiración del token
- Renueva el token antes de que expire (5 minutos de anticipación)
- Verifica cada minuto el estado del token

## Flujo de Funcionamiento

### Login
1. Usuario hace login
2. Se almacenan access token y refresh token
3. Se inicia el monitoreo automático del token

### Peticiones HTTP
1. Interceptor agrega automáticamente el Bearer token
2. Si recibe 401, intenta renovar el token
3. Si el refresh falla, hace logout automático

### Refresh Automático
1. AuthService verifica cada minuto automáticamente
2. Si el token expira en menos de 5 minutos, lo renueva
3. Actualiza tokens en localStorage y estado

## Endpoints Utilizados

- `POST /user/login`: Login inicial
- `POST /user/refresh-token`: Renovar access token

## Configuración

El interceptor está configurado en `app.config.ts`:

```typescript
provideHttpClient(withInterceptors([AuthInterceptor]))
```

## Uso

### En componentes:
```typescript
// Refrescar manualmente
this.authService.refreshAccessToken().subscribe({
  next: (response) => console.log('Token renovado'),
  error: (error) => console.error('Error al renovar')
});

// Verificar estado del token
const timeRemaining = this.authService.getTokenTimeRemaining();
const isExpiringSoon = this.authService.isTokenExpiringSoon();
```

### Información del token:
```typescript
// Obtener información completa
const tokenInfo = this.authService.getTokenInfo();
```

## Características de Seguridad

- **Renovación automática**: El token se renueva antes de expirar
- **Manejo de errores**: Si el refresh falla, se hace logout automático
- **Prevención de múltiples requests**: Evita llamadas simultáneas al refresh
- **Cola de peticiones**: Las peticiones se ponen en cola durante el refresh
- **Almacenamiento seguro**: Tokens se almacenan en localStorage

## Debugging

Para debugging, puedes usar el componente `TokenInfoComponent` que muestra:
- Estado de autenticación
- Tiempo restante del token
- Advertencia si expira pronto
- Botón para refresh manual

## Notas Importantes

1. El refresh token debe ser enviado al endpoint `/user/refresh-token`
2. El sistema maneja automáticamente la renovación
3. Si el refresh falla, el usuario es deslogueado automáticamente
4. Los tokens se almacenan en localStorage para persistencia
5. El monitoreo se inicia automáticamente al hacer login 
