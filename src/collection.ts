import {operationsForScope, ScopedOperation} from "./operation";
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


export function collection<S extends string, T extends Identifiable>(definition: CollectionApiDefinition<S>, scope: S, items: T[]): Collection<Omit<T, '@id'>> {
  return {
    '@id': definition.id,
    '@operation': operationsForScope(definition.operations, scope),
    member: items.map(item => {
      const { '@id': id, ...itemResource} = item
      return resource({id: `/${id}`, operations: definition.member.operations }, scope, itemResource, definition.id)
    }),
    totalItems: items.length
  }
}

export function collectionOf<T extends Identifiable = Identifiable, R = never>(items: T[], properties?: R): CollectionItem<T, R> {
  return {items, properties}
}
