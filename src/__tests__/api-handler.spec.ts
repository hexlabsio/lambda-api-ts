import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {TypedHandler, handler, Handler, TypedResult} from "../api-handler";
import fn = jest.fn;
import Mock = jest.Mock;

interface Response {key: string}
let mockHandler: Mock<TypedResult<Response>, [APIGatewayProxyEvent]> = fn();
const testEvent: APIGatewayProxyEvent = {headers: {'a': 'b'}, body: JSON.stringify({key: 'hello test'})} as unknown as APIGatewayProxyEvent;
let handle: Handler;

describe('api-handler', () => {
  it('should invoke api function passed and map response body to string', async () => {
    const expectedResponse = {key: 'value'};
     givenValidHandler();
     givenHandlerReturns(expectedResponse);
     const result = whenInvokedWith(testEvent);
     await result.thenShouldInvokeHandlerOnce();
     await result.thenShouldBe200OKWithBody(JSON.stringify(expectedResponse));
  });
  
  it('should respond when not an object', async () => {
    const expectedResponse ='some string';
    givenValidHandler();
    givenHandlerReturns(expectedResponse);
    const result = whenInvokedWith(testEvent);
    await result.thenShouldInvokeHandlerOnce();
    await result.thenShouldBe200OKWithBody(JSON.stringify(expectedResponse));
  });
});

function givenValidHandler() {
  handle = handler(mockHandler as unknown as TypedHandler<Response>);
}

function givenHandlerReturns<T>(result: T) {
  mockHandler.mockReturnValue({ statusCode: 200, body: result as unknown as Response })
}

function whenInvokedWith(event: APIGatewayProxyEvent): Result {
  return new Result(handle(event));
}

class Result {
  constructor(private readonly result: Promise<APIGatewayProxyResult>) {}
  
  async thenShouldInvokeHandlerOnce(){
    await this.result;
    expect(mockHandler).toHaveBeenCalledWith(testEvent);
  }
  
  async thenShouldBe200OKWithBody(body: string) {
    const response = await this.result;
    console.log(response);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(body);
  }
}
