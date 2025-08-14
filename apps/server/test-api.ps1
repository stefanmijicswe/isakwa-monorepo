# Test script za API
Write-Host "🧪 Testiranje IsaKwa API-ja..." -ForegroundColor Yellow

# Base URL
$baseUrl = "http://localhost:3001/api"

# Test 1: Public endpoint
Write-Host "`n1. Testiranje javnog endpointa..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test/public" -Method GET
    Write-Host "✅ Javni endpoint radi:" -ForegroundColor Green
    Write-Host $response.message -ForegroundColor White
} catch {
    Write-Host "❌ Greška pri testiranju javnog endpointa: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Registracija Admin korisnika
Write-Host "`n2. Registracija Admin korisnika..." -ForegroundColor Cyan
$adminData = @{
    email = "admin@isakwa.com"
    password = "admin123"
    firstName = "Admin"
    lastName = "Administrator"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "✅ Admin registrovan uspešno!" -ForegroundColor Green
    $adminToken = $adminResponse.access_token
    Write-Host "User: $($adminResponse.user.firstName) $($adminResponse.user.lastName) ($($adminResponse.user.role))" -ForegroundColor White
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Admin već postoji, pokušavam login..." -ForegroundColor Yellow
        $loginData = @{
            email = "admin@isakwa.com"
            password = "admin123"
        } | ConvertTo-Json
        
        try {
            $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
            $adminToken = $adminResponse.access_token
            Write-Host "✅ Admin uspešno ulogovan!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Greška pri logovanju admina: $($_.Exception.Message)" -ForegroundColor Red
            return
        }
    } else {
        Write-Host "❌ Greška pri registraciji admina: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
}

# Test 3: Registracija Profesor korisnika
Write-Host "`n3. Registracija Profesor korisnika..." -ForegroundColor Cyan
$profesorData = @{
    email = "profesor@isakwa.com"
    password = "profesor123"
    firstName = "Marko"
    lastName = "Petrović"
    role = "PROFESOR"
    department = "Informatika"
    title = "Dr"
    phoneNumber = "+381611234567"
    officeRoom = "101"
} | ConvertTo-Json

try {
    $profesorResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $profesorData -ContentType "application/json"
    Write-Host "✅ Profesor registrovan uspešno!" -ForegroundColor Green
    $profesorToken = $profesorResponse.access_token
    Write-Host "User: $($profesorResponse.user.firstName) $($profesorResponse.user.lastName) ($($profesorResponse.user.role))" -ForegroundColor White
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Profesor već postoji, pokušavam login..." -ForegroundColor Yellow
        $loginData = @{
            email = "profesor@isakwa.com"
            password = "profesor123"
        } | ConvertTo-Json
        
        try {
            $profesorResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
            $profesorToken = $profesorResponse.access_token
            Write-Host "✅ Profesor uspešno ulogovan!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Greška pri logovanju profesora: $($_.Exception.Message)" -ForegroundColor Red
            return
        }
    } else {
        Write-Host "❌ Greška pri registraciji profesora: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
}

# Test 4: Registracija Student korisnika
Write-Host "`n4. Registracija Student korisnika..." -ForegroundColor Cyan
$studentData = @{
    email = "student@isakwa.com"
    password = "student123"
    firstName = "Ana"
    lastName = "Milić"
    role = "STUDENT"
    studentIndex = "SW123-2021"
    year = 3
    program = "Softversko inženjerstvo"
    phoneNumber = "+381611234568"
} | ConvertTo-Json

try {
    $studentResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $studentData -ContentType "application/json"
    Write-Host "✅ Student registrovan uspešno!" -ForegroundColor Green
    $studentToken = $studentResponse.access_token
    Write-Host "User: $($studentResponse.user.firstName) $($studentResponse.user.lastName) ($($studentResponse.user.role))" -ForegroundColor White
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Student već postoji, pokušavam login..." -ForegroundColor Yellow
        $loginData = @{
            email = "student@isakwa.com"
            password = "student123"
        } | ConvertTo-Json
        
        try {
            $studentResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
            $studentToken = $studentResponse.access_token
            Write-Host "✅ Student uspešno ulogovan!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Greška pri logovanju studenta: $($_.Exception.Message)" -ForegroundColor Red
            return
        }
    } else {
        Write-Host "❌ Greška pri registraciji studenta: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
}

# Test 5: Zaštićeni endpoint (bilo koji ulogovan korisnik)
Write-Host "`n5. Testiranje zaštićenog endpointa..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $response = Invoke-RestMethod -Uri "$baseUrl/test/protected" -Method GET -Headers $headers
    Write-Host "✅ Zaštićeni endpoint radi:" -ForegroundColor Green
    Write-Host $response.message -ForegroundColor White
} catch {
    Write-Host "❌ Greška pri testiranju zaštićenog endpointa: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Admin-only endpoint
Write-Host "`n6. Testiranje admin-only endpointa..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $adminToken" }
    $response = Invoke-RestMethod -Uri "$baseUrl/test/admin-only" -Method GET -Headers $headers
    Write-Host "✅ Admin endpoint radi:" -ForegroundColor Green
    Write-Host $response.message -ForegroundColor White
} catch {
    Write-Host "❌ Greška pri testiranju admin endpointa: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Professor-only endpoint
Write-Host "`n7. Testiranje professor-only endpointa..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $profesorToken" }
    $response = Invoke-RestMethod -Uri "$baseUrl/test/professor-only" -Method GET -Headers $headers
    Write-Host "✅ Professor endpoint radi:" -ForegroundColor Green
    Write-Host $response.message -ForegroundColor White
} catch {
    Write-Host "❌ Greška pri testiranju professor endpointa: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Student-only endpoint
Write-Host "`n8. Testiranje student-only endpointa..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $studentToken" }
    $response = Invoke-RestMethod -Uri "$baseUrl/test/student-only" -Method GET -Headers $headers
    Write-Host "✅ Student endpoint radi:" -ForegroundColor Green
    Write-Host $response.message -ForegroundColor White
} catch {
    Write-Host "❌ Greška pri testiranju student endpointa: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: Testiranje autorizacije - student pokušava da pristupi admin endpointu
Write-Host "`n9. Testiranje autorizacije (student → admin endpoint)..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $studentToken" }
    $response = Invoke-RestMethod -Uri "$baseUrl/test/admin-only" -Method GET -Headers $headers
    Write-Host "❌ Student je uspeo da pristupi admin endpointu - greška u autorizaciji!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "✅ Autorizacija radi - student nema pristup admin endpointu" -ForegroundColor Green
    } else {
        Write-Host "❌ Neočekivana greška: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 10: Multi-role endpoint (professor ili admin)
Write-Host "`n10. Testiranje multi-role endpointa..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $profesorToken" }
    $response = Invoke-RestMethod -Uri "$baseUrl/test/professor-or-admin" -Method GET -Headers $headers
    Write-Host "✅ Multi-role endpoint radi (profesor):" -ForegroundColor Green
    Write-Host $response.message -ForegroundColor White
} catch {
    Write-Host "❌ Greška pri testiranju multi-role endpointa: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Testiranje završeno!" -ForegroundColor Yellow
