// Consul configuration file
datacenter = "gasrapido-dc1"
data_dir = "/consul/data"
ui = true
log_level = "INFO"

// Server configuration
server = true
bootstrap_expect = 1

// Network configuration
bind_addr = "0.0.0.0"
client_addr = "0.0.0.0"

// Ports
ports {
  http = 8500
  https = 8501
  grpc = 8502
  dns = 8600
}

// Telemetry
telemetry {
  prometheus_retention_time = "60s"
  disable_hostname = true
}

// Service registration
service {
  id = "consul"
  name = "consul"
  address = ""
  port = 8500
  checks = [
    {
      name = "Consul Server HTTP API"
      http = "http://localhost:8500/v1/status/leader"
      interval = "10s"
      timeout = "5s"
    }
  ]
}