# Migraciones de base de datos

## Decisión

Las migraciones viven dentro de cada módulo, en:

```text
src/modules/<modulo>/infrastructure/database/migrations/
```

La decisión mantiene la propiedad de los datos definida en la arquitectura: un módulo no toca las tablas de otro. El `DataSource` compartido solo descubre y ejecuta las migraciones de todos los módulos; no contiene SQL que pertenezca a un módulo concreto.

Las entidades seguirán la misma frontera:

```text
src/modules/<modulo>/infrastructure/database/entities/
```

## Convenciones de esquema

- Los identificadores de las tablas son `uuid` y usan UUID v7.
- La aplicación genera el UUID v7 antes de persistir la entidad. La base de datos no asigna identificadores por defecto; así el identificador existe desde el inicio del caso de uso y se evita acoplar la generación a una extensión concreta de PostgreSQL.
- Las columnas de fecha y hora usan `timestamptz` y representan instantes en UTC. La aplicación intercambia fechas en ISO 8601 con zona horaria explícita y no guarda horas locales.
- Los nombres de tablas, columnas, índices, restricciones y claves foráneas usan `snake_case`.
- Toda tabla con ciclo de vida persistente incluye `created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP` y `updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP`.
- `created_at` no cambia después de insertar. `updated_at` se actualiza desde el adaptador de persistencia en cada modificación; una migración no debe depender de una zona horaria local.
- Las entidades de TypeORM deben declarar explícitamente los nombres físicos en `snake_case`; no se delega la convención al nombre de la propiedad TypeScript.

Una migración de un módulo no debe crear, modificar ni eliminar tablas propiedad de otro módulo. Las referencias entre módulos se expresan mediante identificadores y reglas de aplicación, no mediante claves foráneas entre sus tablas.

## DataSource

`src/infrastructure/database/data-source.ts` es la configuración compartida por NestJS y la CLI de TypeORM:

- `DatabaseModule` usa `databaseOptions` para registrar TypeORM dentro de la aplicación.
- La CLI importa el `default export` (`AppDataSource`) mediante `-d`.
- `synchronize` permanece desactivado; el esquema cambia únicamente mediante migraciones.
- Las rutas incluyen `.js` y `.ts` para funcionar tanto desde `src` como desde `dist`.

La instancia exportada para la CLI no se registra como un segundo proveedor en NestJS. `TypeOrmModule` administra la conexión de la aplicación a partir de las mismas opciones, evitando dos conexiones gestionadas por Nest.

## Comandos

Aplicar todas las migraciones pendientes:

```bash
pnpm migration:run
```

Revertir la última migración aplicada:

```bash
pnpm migration:revert
```

Consultar el estado:

```bash
pnpm migration:show
```

Generar una migración después de modificar entidades:

```bash
pnpm migration:generate -- src/modules/<modulo>/infrastructure/database/migrations/<nombre>
```

Cada migración debe implementar `up` y `down`. `down` debe revertir únicamente los cambios realizados por su `up`.
