export type AccountType = 'microsoft' | 'offline' | 'third_party';

export interface AccountCapabilities {
  verified_ownership: boolean;
  singleplayer_and_lan: boolean;
  online_mode_servers: boolean;
  offline_mode_servers: boolean;
  realms_access: boolean;
  personal_skin: boolean;
}

export interface AccountProfile {
  id: string;
  username: string;
  account_type: AccountType;
  uuid: string;
  capabilities: AccountCapabilities;
  avatar_url?: string;
}

export interface GameInstance {
  schema_version: number;
  id: string;
  name: string;
  mc_version: string;
  loader: 'vanilla' | 'fabric';
  loader_version?: string;
  ram_mb: number;
  custom_jvm_args?: string;
  created_at: string;
  last_played?: string;
}

export type PlayState =
  | 'INSTALL'
  | 'INSTALLING'
  | 'VERIFYING'
  | 'READY'
  | 'LAUNCHING'
  | 'RUNNING'
  | 'REPAIR'
  | 'DISABLED';

export interface SmartDropReview {
  fileName: string;
  contentType: 'FabricMod' | 'ResourcePack' | 'ShaderPack' | 'WorldSave' | 'ModrinthPack' | 'Unsupported';
  fileSizeBytes: number;
  targetGame: string;
  compatNote?: string;
  dependencies: string[];
}

export interface GuidedReportData {
  report_id: string;
  report_type: string;
  loam_version: string;
  os_version: string;
  total_ram_gb: number;
  mc_version: string;
  loader: string;
  java_version: string;
  memory_mb: number;
  account_type: string;
  happened: string;
  expected: string;
  steps: string;
}
