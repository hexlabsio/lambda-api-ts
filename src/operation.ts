import {APIGatewayProxyEvent} from "aws-lambda";

export type SchemaReference = string;
export type HttpStatusCode = number;
export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export interface Operation {
  method: HttpMethod,
  expects?: SchemaReference,
  returns?: SchemaReference,
  statusCodes: HttpStatusCode[]
}

export type ScopedOperation<S extends string> = Operation & { scopes: S[] };

export type ScopeDiscovery<S extends string> = (event: APIGatewayProxyEvent) => S

function operationWithoutScope(operation: ScopedOperation<any>): Operation {
  const {scopes, ...unscoped} = operation;
  return unscoped;
}

function operationIncludes<S extends string>(scope: S) {
  return (operation: ScopedOperation<S>) => operation.scopes.includes(scope);
}

export function operationsForScope<S extends string>(operations: ScopedOperation<S>[], scope: S): Operation[] {
  return operations.filter(operationIncludes(scope)).map(operationWithoutScope);
}
