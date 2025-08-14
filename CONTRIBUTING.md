# Contributing Guidelines

## Branch Strategija
- `main` - production kod
- `dev` - development kod
- `feature/*` - pojedinačne funkcionalnosti

## Workflow
1. Kreiraj feature branch iz dev-a
2. Napravi izmjene
3. Kreiraj PR na dev
4. Dobij 2 review-a
5. Merge u dev
6. Kreiraj PR iz dev-a na main
7. Dobij 3 review-a
8. Merge u main

## Code Review
- Stefan review-uje sve PR-ove
- Adnan i Kristina review-uju međusobno svoje PR-ove
- Adnan i Kristina review-uju Stefan-ove PR-ove

## Napomena
Pošto nemamo GitHub paid plan, koristimo gentleman's agreement za branch protection. Svi se usmeno dogovaramo da poštujemo ova pravila i ne push-ujemo direktno na main branch.

## Conventional Commits
Preporučujemo korištenje Conventional Commits za bolju organizaciju koda i automatsko generisanje changelog-a.

**Link:** https://www.conventionalcommits.org/

**Format:** `tip(scope): opis`

**Primjeri:**
- `feat(auth): add login functionality`
- `fix(dashboard): fix sidebar layout issues`
- `docs(readme): update documentation` 
- `style(ui): improve button design`
- `refactor(api): reorganize users module`
- `test(auth): add unit tests for login`

**Tipovi komitova:**
- `feat` - nova funkcionalnost
- `fix` - popravka bug-a
- `docs` - promjene u dokumnetaciji  
- `style` - formatiranje, stil (ne utječe na funkcionalnost)
- `refactor` - refaktoring koda
- `test` - dodavanje ili izmjena testova
- `chore` - održavanje, konfiguracija

## Timska Pravila
- NIKO ne push-uje direktno na main
- SVI koriste feature branches
- SVI rade PR-ove za review
- SVI review-uju kod drugih članova tima
- Za merge na main svi se zajedno dogovaramo kada i kako ćemo to raditi
- POŽELJNO je koristiti conventional commits za bolje praćenje promjena
- **Commit poruke pišemo na engleskom** (osim ako baš mora na srpskom) 