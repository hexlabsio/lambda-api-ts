import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export type TypedResult<T> = Omit<APIGatewayProxyResult, 'body'> & { body: T };
export type Handler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
export type TypedHandler<T> = (event: APIGatewayProxyEvent) => Promise<TypedResult<T>>;

export function handler<T>(api: TypedHandler<T>): Handler {
  return async event => {
    const result = await api(event);
    return { ...result, body: result?.body ? JSON.stringify(result.body) : '' };
  };
}
