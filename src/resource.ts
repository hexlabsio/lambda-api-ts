import {Api, apiHandler, Handler} from "./api-handler";
import {Operation, operationsForScope, ScopeDiscovery, ScopedOperation} from "./operation";

export type Identifiable = { id: string }

export interface Resource<T> extends Identifiable {
  resource: T,
  operation: Operation[]
}

export type ResourceApiDefinition<S extends string> = {
  id: string;
  operations: ScopedOperation<S>[]
}

export function resource<S extends string, T>(definition: ResourceApiDefinition<S>, scope: S, item: T, parent: string = ''): Resource<T> {
  return {
    id: parent + definition.id,
    operation: operationsForScope(definition.operations, scope),
    resource: item
  };
}

export function resourceApi<T, S extends string>(definition: ResourceApiDefinition<S>, userScope: ScopeDiscovery<S>, handler: Api<T>): Handler {
  return apiHandler(async event => {
    const {body, ...result} = await handler(event);
    return {
      ...result,
      body: resource(definition, userScope(event), body)
    }
  })
}
