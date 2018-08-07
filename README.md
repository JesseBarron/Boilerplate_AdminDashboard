# GETTING STARTED

```
git clone https://github.com/DillonStreator/Boilerplate_AdminDashboard.git <app-name>
```

```
npm install
```

Create .env and copy .example-env and add necessary variables

*Uncomment line 87 in ./app.js

```
node ./bin/www
```
This will seed the database with admins of different permission levels e.g. "SuperAdmin" & "Admin"

Recomment out line 87 in ./app.js to remove the seeding

Rerun
```
node ./bin/www
```
