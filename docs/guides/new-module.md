# Guía: crear un módulo nuevo

Pasos para agregar un módulo con la estructura de cuatro capas. Ejemplo con un módulo llamado `identity`; sustituye el nombre por el que corresponda.

## 1. Generar el módulo de NestJS

```bash
nest g module modules/identity
```

Esto crea `src/modules/identity/identity.module.ts` y lo registra en `AppModule`.

> `nest g resource` genera una estructura plana (controlador, servicio, DTOs y entidades en la raíz del módulo). Este proyecto no la usa. Si la ejecutas por costumbre, mueve cada archivo a su capa y elimina lo que no necesites.

## 2. Crear las capas

```bash
mkdir -p src/modules/identity/{domain,application,infrastructure,presentation}
touch src/modules/identity/{domain,application,infrastructure,presentation}/.gitkeep
```

Los archivos `.gitkeep` permiten versionar las carpetas vacías. Bórralos cuando una carpeta tenga contenido real.

## 3. Definir la API pública

Crea `src/modules/identity/index.ts`. Mientras el módulo no exponga nada, déjalo así:

```ts
export {};
```

Cuando otro módulo necesite algo de este, se exporta aquí (casos de uso o tipos públicos) y el otro módulo importa **solo** desde este archivo.

## 4. Verificar

```bash
pnpm build
pnpm lint
```

Ambos deben pasar sin errores.

## 5. Actualizar la documentación

- [ ] Agregar o confirmar el módulo en el mapa de [`docs/architecture.md`](../architecture.md#2-mapa-de-módulos).
- [ ] Actualizar el árbol de carpetas del `README.md`.
- [ ] Si el módulo trae una decisión de diseño importante, registrar un ADR.

## Lista de comprobación rápida

- [ ] El módulo está en `src/modules/<nombre>/`.
- [ ] Tiene las cuatro carpetas y su `index.ts`.
- [ ] Está registrado en `AppModule`.
- [ ] `domain/` no importa nada de NestJS, ORM, Redis ni colas.
- [ ] Ningún otro módulo importa archivos internos de este.
