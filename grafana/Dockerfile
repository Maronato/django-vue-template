FROM maronato/grafana:latest

# Default datasources
ADD datasources.yml /etc/grafana/provisioning/datasources/
# Dashboard api file
ADD dashboards.yml /etc/grafana/provisioning/dashboards/
# Folder with dashboards
ADD dashboards /etc/grafana/dashboards/
