import {Api, apiHandler, Handler} from "./api-handler";
import {Operation, operationsForScope, ScopeDiscovery, ScopedOperation} from "./operation";
import {Identifiable, resource, Resource, ResourceApiDefinition} from "./resource";

export interface Collection<T, R> extends Resource<R | undefined> {
  member: Resource<T>[];
  operation: Operation[];
  totalItems: number;
}

export interface CollectionApiDefinition<S extends string> extends ResourceApiDefinition<S>{
  member: {
    operations: ScopedOperation<S>[]
  }
}

export interface CollectionItem<T extends Identifiable, R> {
  items: T[],
  properties?: R
}


export function collection<S extends string, R, T extends Identifiable>(definition: CollectionApiDefinition<S>, scope: S, items: T[], properties?: R): Collection<Omit<T, 'id'>, R> {
  return {
    id: definition.id,
    member: items.map( ({id, ...itemResource}) => resource({ id: `/${id}`, operations: definition.member.operations }, scope, itemResource, definition.id)),
    operation: operationsForScope(definition.operations, scope),
    totalItems: items.length,
    resource: properties
  }
}

export function collectionOf<T extends Identifiable = Identifiable, R = never>(items: T[], properties?: R): CollectionItem<T, R> {
  return {items, properties}
}

export function collectionApi<S extends string, T extends Identifiable, R>(
  definition: CollectionApiDefinition<S>,
  scope: ScopeDiscovery<S>,
  handler: Api<CollectionItem<T,R>>
): Handler {
  return apiHandler(async event => {
    const {body: {properties, items}, ...result} = await handler(event);
    return {
      ...result,
      body: collection(definition, scope(event), items, properties)
    }
  })
}


