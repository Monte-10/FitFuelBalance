# FitFuelBalance

FitFuelBalance es una plataforma integral de salud y rendimiento que combina:

1. **Backend** (Django + Django REST Framework) – directorio `fitfuelbalance/`
2. **Frontend Web** (React + Bootstrap 5) – directorio `fitfuel-app/`
3. **Aplicación móvil** (React Native Expo) – directorio `fitfuelmobile/`

El objetivo principal es permitir a entrenadores y usuarios gestionar planes de nutrición y entrenamiento, llevar un seguimiento de métricas y generar PDFs de planes personalizados.

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Arquitectura general](#arquitectura-general)
3. [Instalación y ejecución](#instalación-y-ejecución)
4. [Variables de entorno](#variables-de-entorno)
5. [Características principales](#características-principales)
6. [Estructura de carpetas](#estructura-de-carpetas)
7. [Endpoints API](#endpoints-api)
8. [Scripts útiles](#scripts-útiles)
9. [Pruebas](#pruebas)
10. [Despliegue](#despliegue)

---

## Stack tecnológico

| Capa | Tecnología | Descripción |
|------|------------|-------------|
| Backend | **Python 3.10** / **Django 4** / **DRF 3** | API REST, autenticación, lógica de negocio |
| Base de datos | **SQLite / PostgreSQL** | SQLite por defecto en dev, preparada para PostgreSQL en prod |
| Frontend Web | **React 18** / **Vite** / **Bootstrap 5** | SPA con rutas protegidas y temas oscuro/claro |
| Frontend Mobile | **React Native (Expo)** | Cliente móvil; consume la misma API |
| Autenticación | **Token Auth (DRF Token)** | Inicio de sesión seguro, gestión de tokens |
| Otros | **TinyMCE**, **Quill**, **ApexCharts** | Librerías de editor y visualización de datos |

---

## Arquitectura general

```text
                             +---------------------------+
                             |    React Native App      |
                             |  (fitfuelmobile/)        |
                             +-----------+---------------+
                                         | REST calls
+----------------+           +-----------v---------------+
| Navegador      |  REST     |  Django REST Framework    |
| React SPA      +---------->+  (fitfuelbalance/)        |
| (fitfuel-app/) |           |  auth, models, pdf, etc.  |
+----------------+           +-------------+-------------+
                                         |
                                         | ORM
                                 +-------v-------+
                                 |  DB (Postgre) |
                                 +---------------+
```

---

## Instalación y ejecución

### 1. Clonar repositorio

```bash
git clone https://github.com/Monte-10/FitFuelBalance.git
cd FitFuelBalance
```

### 2. Backend

```bash
# Crear y activar venv
python3 -m venv .venv && source .venv/bin/activate

# Instalar dependencias
pip install -r fitfuelbalance/requirements.txt

# Variables de entorno
cp fitfuelbalance/variables.env.example fitfuelbalance/variables.env
# Editar según tu entorno

# Migraciones y superusuario
python fitfuelbalance/manage.py migrate
python fitfuelbalance/manage.py createsuperuser¡

# Levantar servidor
python fitfuelbalance/manage.py runserver 8000
```

### 3. Frontend Web

```bash
cd fitfuel-app
npm install
npm start           # http://localhost:3000
```

---

## Variables de entorno

| Archivo | Clave | Descripción |
|---------|-------|-------------|
| `fitfuelbalance/variables.env` | `DJANGO_SECRET_KEY` | Clave secreta Django |
| | `DB_NAME`, `DB_USER`, … | Parámetros BD |
| | `ALLOWED_HOSTS` | Hosts permitidos |
| `fitfuel-app/.env` | `REACT_APP_API_URL` | URL de la API backend |

> **Tip:** copia los ejemplos `*.example` y adáptalos a tu entorno.

---

## Características principales

### Módulo Usuario
- Registro (cliente o entrenador)
- Inicio de sesión con token y refresco
- Perfil, subida de avatar e info de contacto
- Gestión de relaciones entrenador ⇄ cliente

### Módulo Nutrición
**Funcionalidad principal**
- Tablas comparativas de planes: permite al entrenador crear hasta 3 planes alternativos y compararlos comida a comida, asignando al cliente la tabla completa.

**Extras (legacy / opcional)**
- Planes individuales clásicos: flujo anterior similar a MyFitnessPal; se mantiene por compatibilidad pero no es el foco.

- CRUD de Ingredientes y Platos
- Generación de Planes nutricionales calendados
- Tabla comparativa de planes para elegir la mejor opción
- Cálculo automático de macronutrientes
- Exportación a PDF

### Módulo Entrenamiento
- Creación de ejercicios con imágenes
- Agrupación en entrenamientos y semanas
- Asignación de rutinas a clientes
- Seguimiento de progreso

### Móvil
- Versión resumida para clientes (ver planes, rutinas, progreso)

---

## Estructura de carpetas

```text
FitFuelBalance/
├── fitfuelbalance/     # Backend Django project
│   ├── nutrition/      # App nutrición
│   ├── sport/          # App entrenamiento
│   ├── user/           # App usuarios y auth
│   └── ...
├── fitfuel-app/        # Frontend React SPA
│   ├── src/components/
│   │   ├── nutrition/
│   │   ├── sport/
│   │   └── user/
│   └── public/
├── fitfuelmobile/      # React Native Expo
│   └── src/
└── README.md           # (este archivo)
```

---

## Endpoints API (resumen)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login y obtención de token |
| GET | `/nutrition/ingredients/` | Listar ingredientes (filtro `search`, paginación) |
| POST | `/nutrition/ingredients/` | Crear ingrediente |
| GET/PUT/DELETE | `/nutrition/ingredients/{id}/` | Detalle ingrediente |
| GET | `/nutrition/plans/` | Listar planes |
| POST | `/nutrition/plans/` | Crear plan |
| PUT | `/nutrition/plans/{id}/` | Actualizar plan |
| GET | `/sport/exercises/` | Listar ejercicios |
| POST | `/sport/week-trainings/assign/` | Asignar rutina a usuario |

*(Ver código en `nutrition/urls.py`, `sport/urls.py`, `user/urls.py` para el detalle completo.)*

---

## Scripts útiles

```bash
# Formateo automático
black .

# Lint Python
flake8

# Ejecutar tests backend
pytest

# Lint + formateo frontend
npm run lint --prefix fitfuel-app
npm run format --prefix fitfuel-app
```

---

## Makefile (Backend)

En `fitfuelbalance/makefile` tienes objetivos que aceleran tareas comunes:

| Objetivo | Comando ejecutado | Descripción |
|----------|------------------|-------------|
| `migrations` | `python manage.py makemigrations sport user nutrition` | Genera migraciones para las tres apps principales |
| `migrate` | `python manage.py migrate` | Aplica todas las migraciones pendientes |
| `run` | `python manage.py runserver` | Arranca el servidor en `localhost:8000` |
| `all` | Ejecuta `migrations` + `migrate` | Todo en uno |
| `all-run` | Ejecuta `all` y después `run` | Útil para entornos vacíos |

```bash
# Ejemplos
make all-run        # crea/aplica migraciones y levanta el servidor
make migrations     # solo generar migraciones
make run            # servidor sin tocar migraciones
```

---

## Flujos funcionales detallados

### 1. Gestión de Nutrición

1. **Crear Ingredientes**  
   - Navega a **Nutrición → Ingredientes → Nuevo**.  
   - Completa nombre, macros por 100 g/ml, sube imagen opcional y guarda.  
   - También puedes **importar** un CSV (botón *Importar CSV*) con columnas `name, calories, protein, fat, carbohydrates, sugar`.  

2. **Crear Platos**  
   - Combina varios ingredientes indicando cantidad y unidad.  
   - El sistema recalcula calorías y macros totales automáticamente.

3. **Crear Plan Nutricional**  
   - En **Nutrición → Planes → Nuevo**, define nombre, fechas y usuario destinatario.  
   - Una vez guardado aparece la **tabla de comidas** (MealTable).  
   - Pulsa **"+ Añadir Ingrediente"** para cada comida; se abre un modal con búsqueda paginada.  
   - Ajusta cantidades; los totales diarios se recalculan en tiempo real.  
   - Finalmente pulsa *Guardar y Asignar Plan* para persistir.

4. **Comparar Planes**  
   - Usa la sección *Tablas Comparativas* para evaluar varias dietas en paralelo y seleccionar la mejor.

### 2. Gestión de Entrenamiento

1. **Crear Ejercicios**  
   - Sección **Entrenamiento → Ejercicios → Nuevo**.  
   - Ingresa nombre, grupo muscular, descripción, sube imagen/ vídeo.

2. **Crear Entrenamientos y Semanas**  
   - Agrupa ejercicios (con número de series/reps) en un *Training*.  
   - Une varios entrenamientos en un *WeekTraining* y asígnalo a clientes.

3. **Asignar Rutina**  
   - Desde *Mis Clientes* el entrenador selecciona un usuario y le asigna una semana de entrenamiento.

### 3. Perfil de Usuario

- Cada usuario dispone de un **dashboard** con:  
  - Información personal editable (avatar, datos de contacto).  
  - Métricas de progreso (peso, grasa, etc.) visualizadas con **ApexCharts**.  
  - Historial de planes de nutrición y rutinas recibidas.  
- Los entrenadores además ven:  
  - Lista de solicitudes de clientes.  
  - Gestión de clientes actuales y sus progresos.  

---