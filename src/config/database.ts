import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import env from './env';
import type { QueryParams, QueryRunner } from '../types/database';

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export const query = async <T extends QueryResultRow>(
  text: string,
  params: QueryParams = [],
  runner: QueryRunner = pool,
): Promise<QueryResult<T>> => runner.query<T>(text, params);

export const getClient = async (): Promise<PoolClient> => pool.connect();

export const closePool = async (): Promise<void> => {
  await pool.end();
};

export const withTransaction = async <T>(work: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
