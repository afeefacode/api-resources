export type QuerySource = {
  [key: string]: string
}

export class BaseQuerySource {
  public getQuery (): QuerySource {
    return {}
  }

  public push (_query: QuerySource): void {
  }
}
