
export const env = {
  BASE_WEB3_ENDPOINT: { "filecoin": "https://api.node.glif.io", "hyperspace": "https://api.hyperspace.node.glif.io/rpc/v1", "calibration": "https://api.calibration.node.glif.io/rpc/v1" },
  SUPPORTED_NETWORKS: ["filecoin", "hyperspace", "calibration"],
  REGISTRY_ADDRESS: "0x0000000000Ec577Ad90e99CA7817e976e953C3bd",
  WRAPPER_ADDRESS: { "filecoin": "0x46b7a579eDa54bdF1D2739F439C21EE889633020", "hyperspace": "0x46b7a579eDa54bdF1D2739F439C21EE889633020", "calibration": "0x46b7a579eDa54bdF1D2739F439C21EE889633020" },
  MULTICALL_ADDRESS: "0x000090dba70f6e3c172b1148031a8930f38d5449",
  BASE_REGISTRAR_ADDRESS: "0x495afaC4f4272f7c747D6910e74430584Ef1f50A",
}

export type NetworkName = keyof typeof env.WRAPPER_ADDRESS

export type Env = typeof env

