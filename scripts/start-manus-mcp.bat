@echo off
echo Starting Local MCP Server for Manus...
echo This will allow Manus AI to read and write files in this project folder.
echo You can connect to this server in your Manus Connectors dashboard using the command below.
npx -y @modelcontextprotocol/server-filesystem "%cd%"
pause
