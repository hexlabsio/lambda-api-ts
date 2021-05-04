import {TypedHandler, handler, Handler} from "./api-handler";
import {operationsForScope, ScopeDiscovery, ScopedOperation} from "./operation";
import {Identifiable, resource, Resource, ResourceApiDefinition} from "./resource";

export type Collection<T, R = {}> = Resource<R> & {
  member: Resource<T>[];
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


export function collection<S extends string, R, T extends Identifiable>(definition: CollectionApiDefinition<S>, scope: S, items: T[], properties?: R): Collection<Omit<T, '@id'>, R> {
  return {
    '@id': definition.id,
    '@operation': operationsForScope(definition.operations, scope),
    member: items.map(item => {
      const { '@id': id, ...itemResource} = item
      return resource({id: `/${id}`, operations: definition.member.operations }, scope, itemResource, definition.id)
    }),
    totalItems: items.length,
    ...(properties ?? {} as R)
  }
}

export function collectionOf<T extends Identifiable = Identifiable, R = never>(items: T[], properties?: R): CollectionItem<T, R> {
  return {items, properties}
}

export function collectionHandler<S extends string, T extends Identifiable, R>(
  definition: CollectionApiDefinition<S>,
  scope: ScopeDiscovery<S>,
  typedHandler: TypedHandler<CollectionItem<T,R>>
): Handler {
  return handler(async event => {
    const {body: {properties, items}, ...result} = await typedHandler(event);
    return {
      ...result,
      body: collection(definition, scope(event), items, properties)
    }
  })
}
