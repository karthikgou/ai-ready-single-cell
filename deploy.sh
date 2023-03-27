#!/bin/bash

# Replace `ENV_VAR_NAME` with the name of your environment variable
HOST_IP_VALUE=$HOST

# Replace `output.json` with the name of the JSON file you want to create
cat <<EOF > ai-single-cell-react/hostConfig.json
{
  "hostIp": "$HOST_IP_VALUE",
}
EOF

docker-compose up