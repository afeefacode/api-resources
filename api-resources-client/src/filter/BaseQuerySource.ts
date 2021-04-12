export type Query = {
  [key: string]: any
}

export class BaseQuerySource {
  public getQuery (): Query {
    return {}
  }

  public push (_query: Query): void {
  }
}
