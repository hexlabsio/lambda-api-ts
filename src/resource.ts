import {Operation, operationsForScope, ScopedOperation} from "./operation";

export type Identifiable = { '@id': string }

export type Resource<T> = T & Identifiable & {
  '@operation': Operation[]
}

export type ResourceApiDefinition<S extends string> = {
  id: string;
  operations: ScopedOperation<S>[]
}

export function resource<S extends string, T>(definition: ResourceApiDefinition<S>, scope: S, item: T, parent: string = ''): Resource<T> {
  return {
    '@id': parent + definition.id,
    '@operation': operationsForScope(definition.operations, scope),
    ...item
  };
}
