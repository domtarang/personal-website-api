import type { QueryResult, QueryResultRow } from 'pg';

export type QueryParam = string | number | boolean | Date | null;
export type QueryParams = QueryParam[];

export interface QueryRunner {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: QueryParams,
  ): Promise<QueryResult<T>>;
}
