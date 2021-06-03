export type QuerySource = {
  [key: string]: string
}

export class BaseFilterSource {
  public getQuery (): QuerySource {
    return {}
  }

  public push (_query: QuerySource): void {
  }
}
