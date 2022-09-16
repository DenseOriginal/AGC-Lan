# Website for AG-Lan

## How to setup environment

1. Install node16 and npm 8

2. Clone this repo
  `git clone https://github.com/DenseOriginal/AG-Lan.git`

3. Open terminal/cmd and cd into cloned directory
  `cd AG-lan`

4. Install dependincies
  use `npm install`

5. Copy the file `.envbase` and rename the copied file to `.env`
  `cp .envbase .env`

6. Fill out configuration in the newly created `.env` file
  You have to create an application on `https://discord.com/developers/applications` and get OAuth secret
  The callback url should be `< protocol >://< domain >/api/callback` e.g. `http://localhost:3000/api/callback`
  This also need to match a callback url set on the disord developer dashboard
  SESSION_SECRET is just a random string
  And MONGO_URI can be from a self hosted mongodDB or an atlas cluster

7. Verify that `/src/discord/environment.ts` uses the correct channel and role ids

## How to build and run

1. Building the app
  To build the application run `npm run build`, this will create a dist/ folder with the transpiled js

2. To serve the app
  Use `npm run serve` to serve the app on port `3000` or whatever port is set in the process.ENV

3. To build and serve
  Use `npm run build:serve` to build then serve, this command simply issues the other to commands

## Folder structure

```bash
.
├───.adminbro             # Folder for adminbro stuff
├───dist                  # Compiled output, ignored in git
├───public                # Static resources
│   ├───favicon
│   ├───images
│   │   └───logo
│   ├───scripts
│   └───styles
│       └───themes
├───src                   # Folder container the actual code
│   ├───config              # Different files to configure libraries
│   ├───discord             # Folder for the discord bot
│   │   ├───functions         # Discord helper functions
│   │   └───listeners         # Listeners for discord
│   ├───models              # Mongoose models
│   └───routes              # Folder container routing handlers
│       ├───api               # /api
│       ├───lan               # /lan
│       ├───profile           # /profile
│       ├───staff             # Config for adminbro
│       └───tournaments       # /tournaments
└───views                 # Handlebar templates
    ├───admin-bro           # Folder containing jsx for adminbro
    ├───lan                 # Lan templates
    ├───layouts             # Page layouts
    ├───partials            # Partials that can be reused
    ├───profile             # Profile templates
    └───tournament          # Tournament templates
```

## Common reasons why something failed

1. Your firewall doesn't allow acces to mongoDB
  Then configure you firewall to allow you to use mongoDB
