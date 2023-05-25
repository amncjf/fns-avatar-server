
export interface Env {
  BASE_WEB3_ENDPOINT: string;
  SUPPORTED_NETWORKS: string[];
  REGISTRY_ADDRESS: string;
  WRAPPER_ADDRESS: string;
  MULTICALL_ADDRESS: string;
  BASE_REGISTRAR_ADDRESS: string;
}

export type AvatarUploadParams = {
  expiry: string;
  dataURL: string;
  sig: string;
};
