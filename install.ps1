#Requires -Version 5.1
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

if (-not (Get-Command copilot -ErrorAction SilentlyContinue)) {
    throw 'GitHub Copilot CLI is required. Install it using https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli, then run this script again.'
}

& copilot plugin marketplace add AndrewGodlewsky/andrew-skills
if ($LASTEXITCODE -ne 0) {
    throw "Marketplace registration failed (exit $LASTEXITCODE). Installation stopped. If this marketplace is already registered, run: copilot plugin install andrew-skills@andrew-skills"
}

& copilot plugin install andrew-skills@andrew-skills
if ($LASTEXITCODE -ne 0) {
    throw "Plugin installation failed (exit $LASTEXITCODE). See the Copilot output above."
}

Write-Host 'Installed andrew-skills. In a fresh Copilot Chat, use /andrew-skills:grill-me with your plan.'
