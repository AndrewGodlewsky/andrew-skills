# Run manually in PowerShell 7 to complete initial Copilot setup in the disposable profile.
[CmdletBinding()]
param(
    [string]$ProbeRoot = (Join-Path $env:TEMP 'andrew-skills-compatibility-20260914\vscode-r2')
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath (Join-Path $ProbeRoot 'user-data\User\settings.json'))) {
    throw 'The prepared compatibility profile was not found.'
}
$probeLaunch = [System.Diagnostics.ProcessStartInfo]::new()
$probeLaunch.FileName = 'C:\Users\godle\AppData\Local\Programs\Microsoft VS Code\Code.exe'
$probeLaunch.UseShellExecute = $false
$probeLaunch.WorkingDirectory = $ProbeRoot
$probeLaunch.Environment['WF_PROBE_ROOT'] = $ProbeRoot
$probeLaunch.Environment['USERPROFILE'] = Join-Path $ProbeRoot 'home'
$probeLaunch.Environment['APPDATA'] = Join-Path $ProbeRoot 'appdata'
$probeLaunch.Environment['LOCALAPPDATA'] = Join-Path $ProbeRoot 'localappdata'
$probeLaunch.Environment['COPILOT_HOME'] = Join-Path $ProbeRoot 'home\.copilot'
$probeLaunch.Environment['COPILOT_CACHE_HOME'] = Join-Path $ProbeRoot 'copilot-cache'
$probeLaunch.Environment['COPILOT_AUTO_UPDATE'] = 'false'
foreach ($probeArgument in @(
    '--new-window', '--skip-welcome', '--skip-release-notes', '--skip-add-to-recently-opened',
    "--user-data-dir=$ProbeRoot\user-data",
    "--extensions-dir=$ProbeRoot\extensions",
    "--extensionDevelopmentPath=$ProbeRoot\extension"
)) {
    $probeLaunch.ArgumentList.Add($probeArgument)
}
$launchedProbe = [System.Diagnostics.Process]::Start($probeLaunch)
Write-Output "Opened the isolated compatibility profile (process $($launchedProbe.Id))."
