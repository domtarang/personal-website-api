export interface MigrationFile {
  name: string;
  absolutePath: string;
  checksum: string;
  sql: string;
}

export interface AppliedMigration {
  name: string;
  checksum: string;
  applied_at: string;
}

export interface MigrationRecord {
  name: string;
  checksum: string;
  appliedAt: string | null;
  isApplied: boolean;
}

export interface MigrationRunResult {
  appliedCount: number;
  appliedNames: string[];
  pendingCount: number;
  totalCount: number;
}
