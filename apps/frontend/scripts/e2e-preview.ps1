param([Parameter(Mandatory = $true)][string]$Deployment)

$ErrorActionPreference = "Stop"
$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$emailA = "codex-a-$stamp@example.test"
$emailB = "codex-b-$stamp@example.test"
$emailC = "codex-c-$stamp@example.test"
$testPassword = "SyntheticTest42"
$jarA = Join-Path $env:TEMP "agile-a-$stamp.cookies"
$jarB = Join-Path $env:TEMP "agile-b-$stamp.cookies"
$jarC = Join-Path $env:TEMP "agile-c-$stamp.cookies"

function Invoke-Preview([string]$Path, [string]$Method = "GET", [string]$Body = "", [string]$Jar = "") {
  $arguments = @("curl", $Path, "--deployment", $Deployment, "--", "--silent", "--show-error", "--max-time", "45", "--request", $Method, "--header", "Content-Type: application/json")
  if ($Jar) { $arguments += @("--cookie", $Jar, "--cookie-jar", $Jar) }
  if ($Body) { $arguments += @("--data-raw", $Body) }
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    $output = & vercel @arguments 2>&1
    if ($LASTEXITCODE -eq 0) { return (($output | Where-Object { $_ -notmatch "^Vercel CLI" }) -join "`n") }
  }
  throw "Request failed after 3 attempts: $Method $Path :: $($output -join ' ')"
}

try {
  $a = Invoke-Preview "/api/auth/register" "POST" (@{ email = $emailA; password = $testPassword; name = "Codex Alpha" } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  $b = Invoke-Preview "/api/auth/register" "POST" (@{ email = $emailB; password = $testPassword; name = "Codex Beta" } | ConvertTo-Json -Compress) $jarB | ConvertFrom-Json
  $c = Invoke-Preview "/api/auth/register" "POST" (@{ email = $emailC; password = $testPassword; name = "Codex Outsider" } | ConvertTo-Json -Compress) $jarC | ConvertFrom-Json
  "REGISTER=$([bool]($a.id -and $b.id -and $c.id))"

  $me = Invoke-Preview "/api/auth/me" "GET" "" $jarA | ConvertFrom-Json
  "SESSION=$($me.email -eq $emailA)"

  $company = Invoke-Preview "/api/platform/companies" "POST" (@{ name = "E2E Company $stamp"; type = "LLC" } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  "COMPANY_CREATED=$([bool]$company.id)"
  $member = Invoke-Preview "/api/platform/companies/$($company.id)/members" "POST" (@{ email = $emailB; role = "EMPLOYEE" } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  "MEMBER_ADDED=$($member.email -eq $emailB)"

  $chatsA = @(Invoke-Preview "/api/platform/chats" "GET" "" $jarA | ConvertFrom-Json)
  $chatsB = @(Invoke-Preview "/api/platform/chats" "GET" "" $jarB | ConvertFrom-Json)
  $chatA = $chatsA | Where-Object { $_.companyId -eq $company.id } | Select-Object -First 1
  $chatB = $chatsB | Where-Object { $_.id -eq $chatA.id } | Select-Object -First 1
  "COMPANY_CHAT_SHARED=$([bool]($chatA.id -and $chatB.id))"
  $ciphertext = "ciphertext-$stamp"
  $message = Invoke-Preview "/api/platform/chats/$($chatA.id)/messages" "POST" (@{ ciphertext = $ciphertext; iv = "0123456789abcdef"; version = 2 } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  $messages = @(Invoke-Preview "/api/platform/chats/$($chatA.id)/messages" "GET" "" $jarB | ConvertFrom-Json)
  $roundtrip = $messages | Where-Object { $_.id -eq $message.id -and $_.ciphertext -eq $ciphertext }
  "CHAT_CIPHERTEXT_ROUNDTRIP=$([bool]$roundtrip)"

  $vault = Invoke-Preview "/api/platform/vault/projects" "POST" (@{ nameCiphertext = "enc-project-$stamp"; nameIv = "0123456789abcdef"; kdfSalt = "abcdef0123456789"; companyId = $null } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  $item = Invoke-Preview "/api/platform/vault/projects/$($vault.id)/items" "POST" (@{ kind = "API"; titleCiphertext = "enc-title"; titleIv = "0123456789abcdef"; payloadCiphertext = "enc-secret-payload"; payloadIv = "abcdef0123456789" } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  $vaults = @(Invoke-Preview "/api/platform/vault/projects" "GET" "" $jarA | ConvertFrom-Json)
  $found = $vaults | Where-Object { $_.id -eq $vault.id } | Select-Object -First 1
  "VAULT_CIPHERTEXT_ONLY=$([bool]($item.id -and $found.items[0].payloadCiphertext -eq "enc-secret-payload"))"

  $call = Invoke-Preview "/api/platform/calls" "POST" (@{ calleeEmail = $emailB; video = $true } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  $incoming = @(Invoke-Preview "/api/platform/calls" "GET" "" $jarB | ConvertFrom-Json)
  $signal = Invoke-Preview "/api/platform/calls/$($call.id)/signals" "POST" (@{ type = "offer"; payload = @{ sdp = "synthetic-sdp" } } | ConvertTo-Json -Compress -Depth 5) $jarA | ConvertFrom-Json
  $received = @(Invoke-Preview "/api/platform/calls/$($call.id)/signals" "GET" "" $jarB | ConvertFrom-Json)
  $accepted = Invoke-Preview "/api/platform/calls/$($call.id)" "PATCH" (@{ action = "accept" } | ConvertTo-Json -Compress) $jarB | ConvertFrom-Json
  $ended = Invoke-Preview "/api/platform/calls/$($call.id)" "PATCH" (@{ action = "end" } | ConvertTo-Json -Compress) $jarA | ConvertFrom-Json
  $incomingCall = $incoming | Where-Object { $_.id -eq $call.id }
  $receivedSignal = $received | Where-Object { $_.id -eq $signal.id }
  "CALL_SIGNALING=$([bool]($incomingCall -and $receivedSignal -and $accepted.status -eq "ACTIVE" -and $ended.status -eq "ENDED"))"

  $outsider = Invoke-Preview "/api/platform/chats/$($chatA.id)/messages" "GET" "" $jarC
  "OUTSIDER_CHAT_DENIED=$($outsider -match "Forbidden")"
  $guest = Invoke-Preview "/api/platform/companies"
  "GUEST_DENIED=$($guest -match "Authentication required")"
}
catch {
  Write-Output "E2E_ERROR=$($_.Exception.Message)"
  exit 1
}
finally {
  Remove-Item -LiteralPath $jarA, $jarB, $jarC -Force -ErrorAction SilentlyContinue
}
