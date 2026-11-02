# Club Off Limits — demo local

Demo navegable en Next.js para presentar el sitio, el flujo de reservas con seña simulada y el panel administrativo de Club Off Limits.

## Ejecutar

```bash
pnpm install
pnpm dev
```

Abrir `http://localhost:3000`.

## Panel administrativo

- Ruta: `/admin/`
- PIN demo: `1556`

El PIN es sólo una barrera visual para la presentación. No constituye autenticación segura.

## Persistencia

La demo guarda packs, ajustes y reservas en `localStorage` bajo la clave `clubofflimits:demo:v1`. Desde el panel se pueden exportar, importar o restaurar los datos iniciales.

No hay base de datos, cobros reales, mensajes ni servicios externos.

## Verificación

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

El build estático queda en `out/` y puede servirse desde cualquier hosting de archivos HTML/CSS/JS.

## Rutas

- `/` — sitio público
- `/experiencia/` — recorrido y seguridad
- `/grupos/` — propuestas grupales y corporativas
- `/reservar/` — turno y seña simulada
- `/mi-reserva/` — consulta por código
- `/admin/` — agenda, pagos, packs y configuración

Los precios, políticas y horarios visibles son datos de demostración y deben validarse con el cliente antes de una versión productiva.
