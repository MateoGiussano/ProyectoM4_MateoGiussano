# MateDo

Aplicación web de gestión de tareas (SPA), desarrollada como Proyecto Integrador 4. Permite registrarse, organizar tareas propias en la nube con sincronización en tiempo real, y recibir un resumen del estado de las tareas por email.

**Deploy en producción:** https://proyecto-m4-tawny.vercel.app

---

## Tecnologías

- **Frontend:** React + TypeScript, Vite, Tailwind CSS, React Router
- **Backend as a Service:** Firebase (Authentication + Firestore)
- **Email:** AWS SES, invocado desde una función serverless de Vercel (patrón BFF)
- **Testing:** Vitest + React Testing Library
- **Deploy:** Vercel, con integración continua desde GitHub

## Cómo probar la app

La URL de producción es pública. **No hace falta ninguna cuenta ni contraseña de nadie**: cualquiera que entre puede crear su propia cuenta de prueba desde la pantalla de **Registro**, con cualquier email y una contraseña de al menos 6 caracteres.

> ⚠️ **Sobre el botón de email:** AWS SES está en modo sandbox (el modo de pruebas, sin costo), que solo permite enviar emails a direcciones verificadas de antemano. Esto significa que el botón "Enviar resumen por email" va a funcionar solo si iniciás sesión con el email del desarrollador (verificado en SES); con una cuenta de prueba nueva, el envío va a fallar con un error `MessageRejected` — es una limitación esperada del modo sandbox, no un bug de la app.

## Funcionalidades

- Registro, login y logout con Firebase Authentication
- Rutas protegidas: solo un usuario autenticado puede ver sus tareas
- CRUD completo de tareas (crear, editar, eliminar, marcar como completada)
- Persistencia en Firestore, filtrada por usuario, con actualización en tiempo real (`onSnapshot`)
- Envío de un resumen de tareas por email, usando AWS SES a través de una función serverless
- Diseño responsive, mobile-first, con Tailwind CSS

## Arquitectura

El código está organizado por capas, dentro de `src/`:

```
src/
├── api/            (En la raíz del proyecto, no en src: funciones serverless de Vercel)
├── components/     Piezas reutilizables de UI (Button, TaskForm, TaskItem, TaskList, EmailSummaryButton...)
├── context/        AuthContext: estado global de sesión, vía React Context
├── hooks/          Hooks personalizados (useTasks, con la suscripción a Firestore)
├── pages/          Pantallas completas, una por cada ruta (LoginPage, RegisterPage, TasksPage)
├── services/       Lógica que habla con servicios externos (firebase.ts, tasks.ts, authErrors.ts)
├── types/          Definiciones de TypeScript (Task)
└── test/           Configuración global de Vitest
```

La regla general: los **componentes** no conocen Firebase ni AWS directamente, reciben funciones por props o las importan desde `services/`. Esto separa la lógica de negocio de la UI y permite testear cada pieza por separado, con mocks.

## Cómo correr el proyecto en local

1. Clonar el repositorio e instalar dependencias:
```bash
   git clone https://github.com/MateoGiussano/ProyectoM4_MateoGiussano.git
   cd ProyectoM4_MateoGiussano
   npm install
```

2. Crear un archivo `.env` en la raíz, con las variables de Firebase (ver `.env.example`):
```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
```
   Estas se toman de la configuración del proyecto de Firebase (Configuración del proyecto → Tus apps). No son secretas: están pensadas para ser visibles en el frontend, por eso llevan el prefijo `VITE_`.

3. En el **mismo archivo `.env`**, agregar las variables de AWS SES (ver `.env.example`):
```
   AWS_REGION=
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   SES_FROM_EMAIL=
```
   A diferencia de las de Firebase, estas **sí son secretas** y por eso no llevan prefijo `VITE_`: solo las lee la función serverless, nunca el navegador. (Nota: en desarrollo local, estas variables funcionaron de forma confiable colocadas en `.env`; en `.env.local` no siempre se cargaban correctamente al ejecutar `vercel dev` en este entorno.)

4. Instalar la CLI de Vercel (necesaria para correr la función serverless en local) y vincular el proyecto:
```bash
   npm install -g vercel
   vercel login
   vercel link
```

5. Levantar el proyecto (usa `vercel dev`, no `npm run dev`, porque este último no ejecuta la carpeta `api/`):
```bash
   vercel dev
```

6. Correr los tests:
```bash
   npm run test
```

## Seguridad

- `.env` y `.env.local` están excluidos del repositorio (`.gitignore`).
- Las reglas de seguridad de Firestore (archivo [`firestore.rules`](./firestore.rules)) impiden que un usuario lea o modifique las tareas de otro. Se probaron explícitamente con un documento de prueba y dos UIDs distintos, confirmando el rechazo (`permission-denied`) y el acceso del dueño.
- Las credenciales de AWS solo existen en el servidor (variables de entorno, nunca en el código del frontend). El usuario IAM (`ses-sender`) tiene una política de permisos mínima, limitada a `ses:SendEmail`.
- El frontend nunca llama a AWS directamente: siempre pasa por el endpoint propio `/api/send-email`, que valida el payload antes de invocar a SES.

## Testing

26 tests con Vitest y React Testing Library, cubriendo:
- Comportamiento de los componentes (`TaskForm`, `TaskItem`, `TaskList`, `EmailSummaryButton`), no solo que rendericen.
- Los servicios de Firestore (`services/tasks.ts`), con Firebase mockeado.
- Los dos casos borde exigidos: **tarea vacía** (formulario y edición) y **error del serverless** (respuesta no exitosa del endpoint de email).

## Registro del uso de IA en el proyecto

Durante el desarrollo se utilizó Claude (Anthropic) como asistente principal, y Antigravity. La IA fue utilizada como herramienta de apoyo para explicar conceptos, guiar decisiones técnicas y acompañar el desarrollo paso a paso. Cada bloque de código fue revisado y comprendido antes de incorporarlo al proyecto, priorizando el aprendizaje sobre la velocidad.

## Autor

Mateo Giussano

- GitHub: [github.com/MateoGiussano](https://github.com/MateoGiussano)
- LinkedIn: [linkedin.com/in/mateo-giussano](https://www.linkedin.com/in/mateo-giussano/)