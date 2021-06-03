import {APIGatewayProxyEvent} from "aws-lambda";
import {TypedResult} from "../api-handler";
import {ScopedOperation} from "../operation";
import {resource, ResourceApiDefinition} from '../resource'

type Scopes = 'admin' | 'read-only'

const scopedOperations: ScopedOperation<Scopes>[] = [
  { method: "GET", scopes: ['admin', 'read-only'], statusCodes: [200] },
  { method: "POST", scopes: ['admin'], statusCodes: [200], expects: 'Something' },
  { method: "PATCH", scopes: ['admin', 'read-only'], statusCodes: [200] }
];

const apiDefinition: ResourceApiDefinition<Scopes> = {
  id: '/test-api',
  operations: scopedOperations
};

const expectedAdminOperations = [
  { method: "GET", statusCodes: [200] },
  { method: "POST", statusCodes: [200], expects: 'Something'  },
  { method: "PATCH", statusCodes: [200] }
];

describe('resource', () => {
  it('should create a Resource from api definition', () => {
    const result = resource(apiDefinition, "admin", { key: 'value' });
    expect(result).toEqual({
      '@id': '/test-api',
      '@operation': expectedAdminOperations,
      key: 'value'
    })
  });
});
