# Guía: contexto de petición

El contexto de petición se resuelve en el módulo transversal `request-context` y se propaga mediante `nestjs-cls`.

## Estructura

```text
src/core/request-context/
├── application/
│   └── ports/
│       └── request-context.ts
├── infrastructure/
│   └── cls-request-context.adapter.ts
└── request-context.module.ts
```

El puerto no conoce NestJS ni `nestjs-cls`:

```ts
export interface RequestContext {
  getId(): string;
  getIp(): string | undefined;
  getActor(): RequestActor | undefined;
  setActor(actor: RequestActor): void;
}

export interface RequestActor {
  id: string;
  role: string;
}
```

La implementación concreta usa `ClsService`. El módulo configura el middleware de `nestjs-cls`, acepta `X-Request-Id` cuando es un UUID válido y genera un UUID nuevo como alternativa.

El actor comienza vacío en cada petición. El guard de autenticación podrá completarlo después de validar las credenciales:

```ts
requestContext.setActor({
  id: user.id,
  role: user.role,
});
```

Los consumidores pueden leerlo mediante `getActor()`. El dominio no debe acceder al contexto ni modificar el actor.

## Uso desde un módulo

El módulo consumidor importa `RequestContextModule` y solicita el token `REQUEST_CONTEXT`:

```ts
import { Inject, Injectable } from '@nestjs/common';

import {
  REQUEST_CONTEXT,
  type RequestContext,
} from '../core/request-context/application/ports/request-context.js';

@Injectable()
export class ExampleUseCase {
  constructor(
    @Inject(REQUEST_CONTEXT)
    private readonly requestContext: RequestContext,
  ) {}

  execute(): void {
    const requestId = this.requestContext.getId();
    const ip = this.requestContext.getIp();

    // Usar estos datos para trazabilidad, auditoría o logs.
  }
}
```

El dominio no debe importar el puerto ni acceder al contexto HTTP. Si el actor autenticado se incorpora en una fase posterior, se agregará al contrato del contexto desde el guard de autenticación, sin que los consumidores lean cabeceras directamente.
