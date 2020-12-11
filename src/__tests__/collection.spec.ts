import {APIGatewayProxyEvent} from "aws-lambda";
import {TypedResult} from "../api-handler";
import {collection, CollectionApiDefinition, collectionOf} from "../collection";
import {ScopedOperation} from "../operation";
import {resource, resourceApi, ResourceApiDefinition} from '../resource'

type Scopes = 'admin' | 'read-only'

const scopedOperations: ScopedOperation<Scopes>[] = [
  { method: "GET", scopes: ['admin', 'read-only'], statusCodes: [200] },
  { method: "POST", scopes: ['admin'], statusCodes: [200], expects: 'Something' },
  { method: "PATCH", scopes: ['admin', 'read-only'], statusCodes: [200] }
];

const apiDefinition: CollectionApiDefinition<Scopes> = {
  id: '/test-api',
  operations: scopedOperations,
  member: {
    operations: scopedOperations
  }
};

const expectedReadOnlyOperations = [
  { method: "GET", statusCodes: [200] },
  { method: "PATCH", statusCodes: [200] }
];

describe('collection', () => {
  
  it('should map array with properties to collection', () => {
    const collection = collectionOf([{id: 'a'}], {'a': 'b'});
    expect(collection).toEqual({
      items: [{id: 'a'}],
      properties: {'a': 'b'}
    });
  });
  
  it('should create a Collection from api definition', () => {
      const result = collection(apiDefinition, "read-only", [{id: 'a', key: 'value1'}, {id: 'b', key: 'value2'}, {id: 'c', key: 'value3'}]);
      expect(result).toEqual({
        id: '/test-api',
        operation: expectedReadOnlyOperations,
        totalItems: 3,
        member: [
          {
            id: '/test-api/a',
            operation: expectedReadOnlyOperations,
            resource: { key: 'value1'}
          },
          {
            id: '/test-api/b',
            operation: expectedReadOnlyOperations,
            resource: { key: 'value2'}
          },
          {
            id: '/test-api/c',
            operation: expectedReadOnlyOperations,
            resource: { key: 'value3'}
          },
          ]
      })
  });
  
  it('should map simple typed body to Resource type in response', async () => {
  
  });
});
