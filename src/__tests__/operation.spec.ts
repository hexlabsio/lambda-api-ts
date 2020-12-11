import {operationsForScope, ScopedOperation} from "../operation";

type Scopes = 'admin' | 'read-only'

describe('operation', () => {
  it('should filter operations that do not have scope and remove scopes', () => {
    const scopedOperations: ScopedOperation<Scopes>[] = [
      { method: "GET", scopes: ['admin', 'read-only'], statusCodes: [200] },
      { method: "POST", scopes: ['admin'], statusCodes: [200] },
      { method: "PATCH", scopes: ['admin', 'read-only'], statusCodes: [200] }
    ];
    const expectedReadOnlyScopes = [
      { method: "GET", statusCodes: [200] },
      { method: "PATCH", statusCodes: [200] }
    ];
  
    const expectedAdminScopes = [
      { method: "GET", statusCodes: [200] },
      { method: "POST", statusCodes: [200] },
      { method: "PATCH", statusCodes: [200] }
    ];
    expect(operationsForScope(scopedOperations, 'read-only')).toEqual(expectedReadOnlyScopes);
    expect(operationsForScope(scopedOperations, 'admin')).toEqual(expectedAdminScopes);
  })
});
