# Design dokument

## Idea

En bruger registrere sig med discord. Ved hjælp af det login kan de tilmelde sig til LAN, og se information omkring LAN.

## Routes

### Public routes

#### Routes som alle brugere kan tilgå

- GET / (index)
  - Landing page

- GET /info
  - FAQ
  - Info omkring næste LAN
    - Tid og sted
    - Start og slut

- GET /tilmeldliste        !! Kan vi give den information ud?
  - Fortæl hvem der skal til LAN
    - Navn, klasse og plads

- POST /tilmeld
  - Tilmelder en til LAN
  - Man skal være logget ind

- POST /frameld
  - Framelder en fra LAN
  - Man skal være logget ind

- GET /turneringer
  - Viser alle turneringer
    - Vis i en tabel
      - Tid, sted og hold/personer tilmeldt
  - Man skal være logget ind

- POST /turnering/tilmeld
  - Tilmelder en person/hold til LAN
  - Data bliver sendt i body
  - Man skal være logget ind

- POST /turnering/frameld
  - Framelder en person/hold fra LAN
  - Data bliver sendt i body
  - Man skal være logget ind

- GET /login
  - Input felter til at logge ind
  - Videresender bruger hvis man er logget ind
  - Bruger service route /api/login til at logge ind

- GET /user/register
  - Input felter til at registrere en bruger
  - Bruger service route /api/register til at oprette en bruger

- GET /user/registered
  - Fortæller at deres bruger blev opretter succesfuldt

- GET /profil
  - Man skal være logget ind
  - Viser brugeren information om dem selv

- GET /profil/edit
  - Tillader brugeren at ændre deres information

- GET /profil/< username >
  - Viser offentlig information om en bruger

- GET /privacy
  - Viser privacy policy

- GET /mad
  - Man skal være logget ind
  - Fortæller brugeren hvad de har bestilt til næste måltid
  - Hvis brugen ikke har bestilt noget, bliver de spurgt om de vil bestille noget

- POST /mad
  - Man skal være logget ind
  - Lader brugeren placere en ordre
  - Data bliver sendt i body

### Admin routes

#### Routes som kun LAN-crew medlemmer kan tilgå

- GET /admin/users?filter=< filter >&direction=<”asc” | “desc”>
  - Lader en admin sortere mellem alle brugere
  - Man kan gå fra en bruger i listen til den specifikke bruge

- GET /admin/profile/< username>
  - Giver flere detaljer om en bruger

- GET /admin/orders
  - Viser alle ordre der er blevet placeret
    - Hvad der er blevet bestilt
    - Hvem der bestilte
    - Status på ordren
      - Placeret
      - Ikke betalt
      - Betalt
      - Ikke hentet
      - Hentet

- GET /admin/turneringer
  - Viser en mere teknisk liste over alle turneringer
    - Tilmeldte hold/personer
    - Status
      - Usynlig
      - Åben
      - I gang
      - Afsluttet

- GET /admin/turnering/< turneringID >
  - Viser alt information om en turnering
  - Tillader en admin at ændre status på turnering

- POST /admin/turnering/< turneringID >
  - Opdatere en turnering
  - Data bliver sendt i body

- GET /admin/nyt-mad
  - Input felter til at oprette et nyt måltid
  - Så man kan bestille mad

- POST /admin/nyt-mad
  - Opretter et nyt måltid
  - Data bliver sendt i body

### Service routes

#### Routes der kun bruges til service, de er kun ment til at blive kaldt fra serveren. Alle er prefixed med ’api’

- POST /api/login
  - Logger en bruger ind og videresender brugeren hvis login lykkedes

- POST /api/logout
  - Loggen en bruger ud og videresender brugeren til / (index)

- POST /api/register
  - Opretter en ny bruger og videresender brugeren til /user/registered

- POST /api/discord/callback
  - Discord callback

## Models

### LAN

```ts
interface LAN {
  _ID: string;
  name: string;
  start: Date;
  end: Date;
  state: "upcoming" | "happening" | "ended";
  user: LanProfileID[]
  description: string;
  seats: string[]; // TODO: Figure out how to implement seats
  food_open: boolean;
  food_meal: MealID;
  price: number;
}
```

### User

```ts
interface User {
  _ID: string;
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  username: string;
  refresh_token: string;
  is_staff: boolean;
  last_login: Date;
  created_at: Date;
  class: string;
  phone: string;
  banned: boolean;
  notes: string[];
  picture_url: string;
  discord_id: string;
}
```

### LanProfile

```ts
interface LanProfile {
  _ID: string;
  user: UserID;
  lan: LanID;
  seat: string;
}
```

### Tournament

```ts
interface Tournament {
  _ID: string;
  game_name: string;
  game_description: string;
  lan: LanID;
  name: string;
  description: string;
  team_size: number;
  open: boolean;
  start: Date;
  end: Date;
}
```

### Meal

```ts
interface Meal {
  _ID: string;
  name: string;
  lan: LanID;
  open: boolean;
  start: Date;
}
```

### MealOrder

```ts
interface MealOrder {
  _ID: string;
  lan_profile: LanProfileID;
  place_time: Date;
  meal: MealID;
  order: string;
  price: number;
  status: "placed" | "not_paid" | "paid" | "not_collected" | "collected";
}
```
