# 🚀 GenAI Frontend - Plataforma de Generación de Código

Una aplicación web moderna construida con **Angular 17+** que permite a los usuarios gestionar proyectos de generación de código a partir de design systems. La plataforma incluye autenticación completa, gestión de proyectos y un sistema de diseño robusto.

![Angular](https://img.shields.io/badge/Angular-20.3.8-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sistema de Diseño](#-sistema-de-diseño)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)

---

## ✨ Características

### ✅ Implementadas

- **🔐 Autenticación Completa**

  - Registro de usuarios con validación de contraseña
  - Inicio de sesión con email y contraseña
  - Gestión de sesión con localStorage
  - Protección de rutas con Guards
  - Cierre de sesión

- **🎨 Sistema de Diseño Moderno**

  - Design tokens (CSS Variables)
  - Componentes reutilizables (Card, Button, Input, Header, Footer)
  - Diseño responsive (Mobile First)
  - Modo claro optimizado
  - Accesibilidad WCAG AA

- **📱 Interfaz de Usuario Responsive**

  - Grid system adaptativo
  - Breakpoints: 640px, 768px, 1024px
  - Optimizado para móvil, tablet y desktop
  - Animaciones y transiciones suaves

- **📊 Dashboard Interactivo**

  - Vista general de proyectos
  - Estadísticas de uso
  - Accesos rápidos a funcionalidades
  - Cards con iconos y efectos hover

- **🗂️ Páginas de Funcionalidades (UI/UX)**
  - Gestión de Proyectos
  - Importar Design System (Figma, Sketch, Adobe XD)
  - Configuración de Generación de Código
  - Vista de Procesamiento con progreso
  - Resultados de Generación
  - Página 404 personalizada

### 🚧 Pendientes de Implementación

- Conexión con API backend
- Integración con Figma/Sketch API
- Generación real de código
- Sistema de plantillas
- Historial de generaciones
- Configuración de usuario

---

## 🛠️ Tecnologías

### Core

- **Angular**: 20.3.8 (Standalone Components)
- **TypeScript**: 5.7.2
- **RxJS**: 7.8.0
- **Node.js**: 22.19.0
- **npm**: 11.6.0

### Herramientas de Desarrollo

- **Angular CLI**: 20.3.8
- **esbuild**: Builder optimizado
- **esbuild**: Rendimiento optimizado
- **TypeScript Strict Mode**: Habilitado
- **Karma & Jasmine**: Testing framework

### Estilos

- **CSS Variables** (Custom Properties)
- **CSS Grid & Flexbox**
- **Mobile First Approach**

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v18.0.0 o superior (recomendado v22.19.0)
- **npm**: v9.0.0 o superior (recomendado v11.6.0)
- **Git**: Para clonar el repositorio

Verifica las versiones instaladas:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/genai-frontend.git
cd genai-frontend/genai-app
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias especificadas en `package.json`.

### 3. Verificar la Instalación

```bash
npm run test -- --watch=false
```

---

## ⚙️ Configuración

### Variables de Entorno

Actualmente, la aplicación usa un sistema de autenticación mock (sin backend). Para configurar una API real en el futuro:

1. Crea un archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

2. Para producción, crea `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.tudominio.com',
};
```

### Configuración de TypeScript

El proyecto usa **TypeScript Strict Mode**. Configuración en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## 💻 Uso

### Desarrollo Local

Inicia el servidor de desarrollo:

```bash
npm start
```

O usando Angular CLI:

```bash
ng serve
```

La aplicación estará disponible en:

- **URL**: http://localhost:4200
- **Hot Reload**: Habilitado (cambios en vivo)

### Build de Producción

Genera una versión optimizada para producción:

```bash
npm run build
```

Los archivos se generarán en `dist/genai-app/`.

### Ejecutar Tests

```bash
# Tests unitarios (una vez)
npm test

# Tests en modo watch
ng test

# Tests con coverage
ng test --code-coverage
```

### Linting (Opcional)

Si tienes ESLint configurado:

```bash
npm run lint
```

---

## 🏗️ Arquitectura

### Patrón de Arquitectura

La aplicación sigue una **arquitectura modular basada en features** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────┐
│           Application Layer              │
│  (app.ts, app.routes.ts, app.html)      │
└─────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐      ┌──────▼─────┐
│  Core  │      │  Features  │
│ Layer  │      │   Layer    │
└───┬────┘      └──────┬─────┘
    │                   │
    │         ┌─────────┴──────────┐
    │         │                    │
┌───▼─────┐ ┌─▼────────┐  ┌──────▼─────┐
│ Shared  │ │   Auth   │  │ Dashboard  │
│  Layer  │ │ Feature  │  │  Feature   │
└─────────┘ └──────────┘  └────────────┘
```

### Capas de la Aplicación

#### 1. **Core Layer** (`src/app/core/`)

Servicios singleton y lógica de negocio central.

- **Services**: Servicios compartidos (AuthService)
- **Models**: Interfaces y tipos TypeScript (User, LoginCredentials)
- **Guards**: Protección de rutas (authGuard)
- **Interceptors**: (Pendiente) HTTP interceptors

```typescript
// Ejemplo: AuthService
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  login(credentials: LoginCredentials): Observable<User>;
  register(data: RegisterData): Observable<User>;
  logout(): void;
  isAuthenticated(): boolean;
}
```

#### 2. **Shared Layer** (`src/app/shared/`)

Componentes y utilidades reutilizables en toda la app.

- **Components**: Card, Button, Input, Header, Footer
- **Directives**: (Pendiente) Directivas personalizadas
- **Pipes**: (Pendiente) Pipes personalizados

```typescript
// Ejemplo: CardComponent
@Component({
  selector: 'app-card',
  standalone: true,
  template: `<div class="card"><ng-content></ng-content></div>`,
})
export class CardComponent {}
```

#### 3. **Features Layer** (`src/app/features/`)

Módulos de funcionalidad específica (lazy loaded).

Cada feature tiene su propia estructura:

```
feature/
├── feature.component.ts
├── feature.component.html
├── feature.component.css
├── feature.component.spec.ts
└── (sub-components)
```

Features implementadas:

- **auth/**: Login y Register
- **dashboard/**: Panel principal
- **projects/**: Gestión de proyectos
- **import-design-system/**: Importación de diseños
- **generate/**: Configuración de generación
- **processing/**: Vista de proceso
- **results/**: Resultados de generación
- **not-found/**: Página 404

---

## 📁 Estructura del Proyecto

```
genai-app/
│
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios y lógica central
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts    # Protección de rutas
│   │   │   ├── models/
│   │   │   │   └── user.model.ts    # Interfaces de datos
│   │   │   └── services/
│   │   │       └── auth.service.ts  # Servicio de autenticación
│   │   │
│   │   ├── shared/                  # Componentes compartidos
│   │   │   └── components/
│   │   │       ├── button/
│   │   │       ├── card/
│   │   │       ├── input/
│   │   │       ├── header/
│   │   │       └── footer/
│   │   │
│   │   ├── features/                # Módulos de funcionalidades
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.css
│   │   │   │   └── register/
│   │   │   │       └── (similar structure)
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── import-design-system/
│   │   │   ├── generate/
│   │   │   ├── processing/
│   │   │   ├── results/
│   │   │   └── not-found/
│   │   │
│   │   ├── app.ts                   # Componente raíz
│   │   ├── app.html                 # Template raíz
│   │   ├── app.css                  # Estilos raíz
│   │   ├── app.config.ts            # Configuración Angular
│   │   └── app.routes.ts            # Configuración de rutas
│   │
│   ├── styles.css                   # Estilos globales + Design System
│   ├── index.html                   # HTML principal
│   └── main.ts                      # Bootstrap de la aplicación
│
├── public/                          # Archivos estáticos
├── angular.json                     # Configuración Angular CLI
├── tsconfig.json                    # Configuración TypeScript
├── package.json                     # Dependencias y scripts
└── README.md                        # Este archivo
```

---

## 🎨 Sistema de Diseño

### Design Tokens (CSS Variables)

Todos los valores de diseño están centralizados en `src/styles.css`:

#### Colores

```css
--color-primary: #2563eb; /* Azul principal */
--color-primary-hover: #1d4ed8; /* Hover state */
--color-primary-light: #dbeafe; /* Backgrounds */
--color-secondary: #64748b; /* Gris secundario */
--color-success: #10b981; /* Verde éxito */
--color-error: #ef4444; /* Rojo error */
--color-warning: #f59e0b; /* Amarillo warning */
```

#### Espaciado

```css
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
--spacing-3xl: 4rem; /* 64px */
```

#### Tipografía

```css
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem; /* 36px */
```

#### Bordes y Sombras

```css
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;

--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Componentes Base

#### Card

```html
<app-card>
  <h2>Título</h2>
  <p>Contenido</p>
</app-card>
```

Variantes disponibles:

- `.card-interactive` - Hover effect
- `.card-highlight` - Fondo degradado
- `.feature-card` - Con icono y animación

#### Button

```html
<button class="btn btn-primary">Acción</button> <button class="btn btn-secondary">Cancelar</button>
```

#### Input

```html
<app-input label="Email" type="email" [formControl]="emailControl" placeholder="tu@email.com">
</app-input>
```

### Grid System Responsive

```html
<!-- 1 columna en móvil, 2 en tablet, 3 en desktop -->
<div class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

Breakpoints:

- `grid-cols-sm-*`: ≥640px
- `grid-cols-md-*`: ≥768px
- `grid-cols-lg-*`: ≥1024px

---

## ✅ Funcionalidades Implementadas

### 1. Sistema de Autenticación

#### Registro de Usuario

- Formulario con validación reactiva
- Campos: Nombre, Email, Password, Confirmar Password
- Validaciones:
  - Email válido
  - Contraseña mínimo 6 caracteres
  - Contraseñas coincidentes
- Mensajes de error en tiempo real
- Almacenamiento en localStorage (mock)

```typescript
// Uso del servicio
this.authService.register({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'password123',
});
```

#### Inicio de Sesión

- Formulario con email y contraseña
- Validación de credenciales
- Gestión de sesión con token
- Redirección automática al dashboard

```typescript
// Uso del servicio
this.authService.login({
  email: 'juan@example.com',
  password: 'password123',
});
```

#### Protección de Rutas

- Guard implementado con `CanActivateFn`
- Redirección automática a login si no autenticado
- Persistencia de sesión con localStorage

```typescript
// En app.routes.ts
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () => import('./features/dashboard/...')
}
```

### 2. Dashboard

**Características:**

- Vista general del usuario logueado
- Grid responsive de 6 cards:
  1. **Proyectos Recientes**: Acceso rápido a proyectos
  2. **Design Systems**: Importar diseños
  3. **Generar Código**: Iniciar generación
  4. **Estadísticas**: Métricas del usuario
  5. **Acciones Rápidas**: CTAs principales
  6. **Novedades**: Actualizaciones de la plataforma
- Iconos emoji grandes y coloridos
- Efectos hover en cards
- Completamente responsive

### 3. Gestión de Proyectos

**Estado actual:** UI/UX completo, pendiente lógica

- Empty state con ilustración
- Llamados a la acción (CTAs)
- Estructura preparada para lista de proyectos
- Cards interactivas con badges

### 4. Importar Design System

**Integraciones preparadas:**

- **Figma**: Card con branding de Figma
- **Sketch**: Card con branding de Sketch
- **Adobe XD**: Card con branding de Adobe XD
- **Subir Archivos**: Upload de JSON/CSS

**Características:**

- Cards con iconos gradient personalizados
- Sección "Cómo funciona" (3 pasos)
- Grid responsive 2x2
- Botones deshabilitados (pendiente implementación)

### 5. Generar Código

**Interfaz preparada:**

- Layout 2 columnas (sidebar + main)
- **Sidebar de configuración:**
  - Selector de Framework (React, Angular, Vue)
  - Selector de Lenguaje (TypeScript, JavaScript)
  - Selector de Estilo (CSS Modules, Styled Components, Tailwind)
  - Checkboxes: Tests, Documentación
- **Área principal:**
  - Vista previa de configuración
  - Empty state
- Botones de acción (Cancelar, Generar)

### 6. Vista de Procesamiento

**Características:**

- Spinner animado grande
- Barra de progreso con animación
- Lista de pasos con estados:
  - ✓ Completado (verde)
  - ⚡ Activo (azul)
  - ○ Pendiente (gris)
- Mensajes informativos
- Diseño centrado

### 7. Resultados de Generación

**Características:**

- Icono de éxito grande
- Estadísticas del código generado:
  - Número de componentes
  - Líneas de código
  - Tokens aplicados
- Botones de acción:
  - Descargar código
  - Copiar al portapapeles
  - Volver al dashboard
- Lista de contenido generado

### 8. Página 404

**Características:**

- Código de error grande (8rem)
- Gradiente en el número
- Fondo con gradiente sutil
- 2 botones de navegación
- Diseño centrado y responsive

---

## 🗺️ Roadmap

### Fase 1: Backend Integration (Pendiente)

- [ ] Conectar con API REST
- [ ] Implementar autenticación JWT
- [ ] CRUD de proyectos
- [ ] Gestión de usuarios
- [ ] Upload de archivos

### Fase 2: Integración con Design Tools (Pendiente)

- [ ] API de Figma
- [ ] API de Sketch
- [ ] Parser de Adobe XD
- [ ] Extracción de design tokens
- [ ] Importación de componentes

### Fase 3: Generación de Código (Pendiente)

- [ ] Motor de generación
- [ ] Plantillas de código
- [ ] Generación React/Angular/Vue
- [ ] Generación de tests
- [ ] Documentación automática

### Fase 4: Mejoras de UX (Pendiente)

- [ ] Tema oscuro
- [ ] Multi-idioma (i18n)
- [ ] Notificaciones toast
- [ ] Historial de generaciones
- [ ] Configuración de usuario
- [ ] Tutorial interactivo

### Fase 5: Testing y Optimización (Pendiente)

- [ ] Tests unitarios completos (80%+ coverage)
- [ ] Tests E2E con Cypress
- [ ] Optimización de performance
- [ ] PWA (Progressive Web App)
- [ ] SEO optimization

---

## 🤝 Contribución

### Guía de Contribución

1. **Fork el proyecto**
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit tus cambios**:
   ```bash
   git commit -m "feat: añadir nueva funcionalidad"
   ```
4. **Push a la rama**:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. **Abre un Pull Request**

### Convenciones de Código

- Usa **TypeScript strict mode**
- Sigue las guías de estilo de Angular
- Usa **Conventional Commits**:
  - `feat:` Nueva funcionalidad
  - `fix:` Corrección de bug
  - `docs:` Documentación
  - `style:` Formato de código
  - `refactor:` Refactorización
  - `test:` Tests
  - `chore:` Tareas de mantenimiento

### Estructura de Commits

```
tipo(scope): descripción corta

Descripción más detallada si es necesario.

- Cambio 1
- Cambio 2

Fixes #123
```
