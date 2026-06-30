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

## Deploy en VM (Ubuntu 22.04)

### 1. Instalar pnpm

```sh
corepack enable
corepack prepare pnpm@latest --activate
```

Verificar: `pnpm -v` debe mostrar la versión.

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