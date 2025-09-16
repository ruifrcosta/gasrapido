export interface BackupConfig {
  primaryBucket: string;
  secondaryBucket: string;
  tertiaryBucket: string;
  encryptionKeyId: string;
  region: string;
  backupSchedule: string; // Cron expression
  retentionDays: number;
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  source: string;
  size: number;
  checksum: string;
  encrypted: boolean;
  compression: string;
  region: string;
  bucket: string;
  path: string;
}

export interface BackupStatus {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: string;
  progress: number;
  metadata?: BackupMetadata;
}

export interface RestoreRequest {
  backupId: string;
  targetEnvironment: 'development' | 'staging' | 'production';
  restorePoint?: string; // Timestamp to restore to
}