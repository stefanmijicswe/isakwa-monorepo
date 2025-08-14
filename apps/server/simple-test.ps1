# Simple test for IsaKwa API
Write-Host "Testing IsaKwa API..." -ForegroundColor Yellow

$baseUrl = "http://localhost:3001/api"

# Admin login
$loginData = @{
    email = "admin@isakwa.com"
    password = "admin123"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$adminToken = $adminResponse.access_token

Write-Host "Admin logged in successfully!" -ForegroundColor Green

# Get all users
$headers = @{ Authorization = "Bearer $adminToken" }
$users = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $headers

Write-Host "Users in system:" -ForegroundColor Cyan
$users | ForEach-Object { 
    Write-Host "- $($_.firstName) $($_.lastName) ($($_.email)) - $($_.role)" -ForegroundColor White
    
    if ($_.profesorProfile) {
        Write-Host "  Professor: $($_.profesorProfile.title) in $($_.profesorProfile.department)" -ForegroundColor Gray
    }
    
    if ($_.studentProfile) {
        Write-Host "  Student: $($_.studentProfile.studentIndex) - Year $($_.studentProfile.year)" -ForegroundColor Gray
    }
}

Write-Host "All tests completed successfully!" -ForegroundColor Green
