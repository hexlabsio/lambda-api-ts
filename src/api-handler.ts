import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export type TypedResult<T> = Omit<APIGatewayProxyResult, 'body'> & { body: T };
export type Handler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
export type Api<T> = (event: APIGatewayProxyEvent) => Promise<TypedResult<T>>;
export type Filter = (next: Handler) => Handler;

export function apiHandler<T>(api: Api<T>): Handler {
  return async event => {
    const result = await api(event);
    return { ...result, body: result?.body ? JSON.stringify(result.body) : '' };
  };
}
