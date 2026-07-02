## Project: react-calendar
Rooms and Courses Reservation Scheduler (looks like Google Calendar)

Features:
* Rooms and Courses Reservation
* Responsive design

## Prerequisites
* [Node js](https://nodejs.org/) v20.x or superior
* [MySQL](https://dev.mysql.com/) v8.x or superior
* [pnpm](https://pnpm.io/) (instalar con `corepack enable && corepack prepare pnpm@latest --activate`)

## Download project
```sh
git clone https://github.com/yromeroz/react-calendar.git
cd react-calendar
```

### Install dependencies
```sh
pnpm install
```

### DB configuration
Create a `.env.local` file in the root directory with the following variables:

```
DATABASE_URL='mysql://dbuser:dbpass@host:3306/calendardb'
```

### Run development server
```sh
pnpm dev
```
The project will be available at http://localhost:3000.

### Build for production
```sh
pnpm build
```

### Run production server
```sh
pnpm start
```

---

## Deploy en VM (Ubuntu 24.04)

### 0. Instalar Node.js 20.x

Ubuntu 24.04 no incluye Node.js por defecto. Instalarlo desde NodeSource (recomendado para producción):

```sh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verificar:

```sh
node -v   # debe mostrar v20.x
npm -v    # debe mostrar 10.x
```

> **Nota**: NO usar `apt install nodejs` directo — el repositorio de Ubuntu 24.04 trae una versión
> desactualizada incompatible con el proyecto.

### 1. Instalar pnpm

**Opción A — Corepack (recomendada, viene con Node.js 16+):**

```sh
corepack enable
corepack prepare pnpm@latest --activate
```

**Opción B — Script standalone (alternativa si Corepack falla):**

```sh
# Si la opción A falla por permisos o versiones de Node.js:
curl -fsSL https://get.pnpm.io/install.sh | sh -
# Cerrar y reabrir sesión, o ejecutar:
source ~/.bashrc
```

Verificar:

```sh
pnpm -v   # debe mostrar 9.x o superior
```

> Corepack instala pnpm a nivel de usuario — no requiere `sudo`.

> ⚠️ pnpm 10 incorpora políticas de seguridad que requieren configuración explícita:
> - **`minimumReleaseAge`**: desactivada en `.npmrc` (paquetes recién publicados como @radix-ui
>   se bloquean por defecto). Ajustable a días: `minimum-release-age=7`.
> - **Build scripts**: solo los paquetes aprobados (`esbuild`, `msw`, `sharp`, `unrs-resolver`)
>   pueden ejecutar scripts `postinstall`, configurado en `package.json` → `pnpm.onlyBuiltDependencies`.
> Ambas configuraciones ya están en el repositorio; tu colega solo necesita hacer `git pull`.

### 2. Clonar y construir

```sh
git clone https://github.com/yromeroz/react-calendar.git /opt/calendar
cd /opt/calendar
pnpm install
pnpm build
```

### 3. Configurar variables de entorno

Crear archivo `/etc/calendar/.env`:

```
DATABASE_URL='mysql://dbuser:dbpass@host:3306/calendardb'
NODE_ENV=production
PORT=3000
```

### 4. Servicio systemd

Crear `/etc/systemd/system/calendar.service`:

```ini
[Unit]
Description=React Calendar Next.js Server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/calendar
EnvironmentFile=/etc/calendar/.env
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 5. Iniciar servicio

```sh
sudo systemctl daemon-reload
sudo systemctl enable calendar
sudo systemctl start calendar
sudo systemctl status calendar
```

### 6. Logs

```sh
sudo journalctl -u calendar -f
```