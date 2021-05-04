import {TypedHandler, handler, Handler} from "./api-handler";
import {Operation, operationsForScope, ScopeDiscovery, ScopedOperation} from "./operation";

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

export function resourceHandler<T, S extends string>(definition: ResourceApiDefinition<S>, userScope: ScopeDiscovery<S>, typedHandler: TypedHandler<T>): Handler {
  return handler(async event => {
    const {body, ...result} = await typedHandler(event);
    return {
      ...result,
      body: resource(definition, userScope(event), body)
    }
  })
}
