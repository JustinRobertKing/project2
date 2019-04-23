# Node/Express/PostreSQL Boilerplate

This is a bare-bones Node/Express app with basic user authentication and authorization. It has local auth on the `master` branch and Facebook auth on the `with-facebook` branch. This boilerplate exists so that I can streamline the creation of project that requires a working auth, without the need to start from scratch.

## What it includes

* Sequelize is set up for PostgreSQL
* Sequelize model and migration(s) for user
* Passport, Express-Session, and Connect-Flash modules
* Error/Success message alerts
* BCrypt for hashing passwords

### User Schema

| Column | Data Type | Description |
|--------|-----------|-------------|
| id | Integer | Primary Key |
| firstname | String | required field |
| lastname | String | - |
| email | String | usernameField for login - required field |
| password | String | hashed with BCrypt before creation of new row |
| birthdate | Date | Might want to use moment module to format this |
| admin | Boolean | Set default value to false |
| image | Text | A URL to an image of the user - required field |
| bio | Text | - |

Additional fields from `with-facebook`

| Column | Data Type | Description |
|--------|-----------|-------------|
| facebookId | String | Facebook Profile Id |
| facebookToken | String | Facebook Login Token |

This is the default schema provided. Add additional migrations as needed for more data.

### Brewery Schema

| Column | Data Type | Description |
|--------|-----------|-------------|
| id | Integer | Primary key |
| apiId | String | ID returned by the API | 
| name | String | - |
| established | String | returns a year from the API |
| imageUrl | String | - |
| long | Decimal | - |
| lat | Decimal | - |
| website | String | - |
| description | Text | - |
| isInBusiness | Boolean | API returns "Y" or "N" |
| status | String | "Verified" or not |
| userId | Integer | Foreign key from user table |


### Beer Schema

| Column | Data Type | Description |
|--------|-----------|-------------|
| id | Integer | Primary key |
| apiId | String | ID returned by the API | 
| name | String | - |
| style | String | Uses shortname from API |
| imageUrl | String | - |
| ibu | Decimal | Bitterness rating | 
| abv | Decimal | Alcohol percentage
| availability | String | - |
| breweryId | Integer | Foreign key from brewery table |
| userId | Integer | Foreign key from user table |


### Added Routes Table

| GET | / | index.js | Home - has map |
| GET | /breweries | controllers/breweries.js | Renders brewery search form |
| POST | /breweries | controllers/breweries.js | Handles query |

### Default Routes Table

By default, the following routes are provided

| Method | Path | Location | Purpose |
|--------|------|----------|---------|
| GET | / | index.js | Home Page |
| GET | /profile | controllers/profile.js | User Profile Page |
| GET | /profile/admin | controllers/profile.js | Admin Dashboard Page |
| GET | /auth/login | controllers/auth.js | Renders Login Form |
| POST | /auth/login | controllers/auth.js | Handles Login Auth |
| GET | /auth/signup | controllers/auth.js | Renders Signup Form |
| POST | /auth/signup | controllers/auth.js | Handles New User Signup |
| GET | /auth/logout | controllers/auth.js | Removes User Session Data |

Additional routes from `with-facebook` branch if using oAuth:

| Method | Path | Location | Purpose |
|--------|------|----------|---------|
| GET | /auth/facebook | controllers/auth.js | Outgoing Request to Facebook |
| GET | /auth/callback/facebook | controllers/auth.js | Incoming Data from Facebook |

## Steps To Use

#### 1. Clone this repository, but with a different name

On your terminal, run:

```
git clone <repo_link> <new_name>
```

#### 2. Decide what the new project needs

If you do not need facebook auth, use the `master` branch. Otherwise, switch to the `with-facebook` branch. 

```
git checkout with-facebook
```

> Note: If using Facebook, you will need to set up a new app on developers.facebook.com

**Part B: Remove stuff not being used**

For example: if you don't intend to have adminw on the new project, remove`middleware/adminLoggedIn.js` and the routes/views for the admin dashboard.

#### 3. Install node modules from package.json

On your terminal, run:

```
npm install
```

> Tip: `npm i` can be used as a shortcut

#### 5. Restructure Git Remotes

Basically, this is git's version of updating the address book.

* First, remove the "old" remote.
	* `git remote remove origin`
* Then go to github and create a new, empty repository
* Copy the new repository link
* Set up a new remote pointing to the new repository
	* `git remote add origin <new_repo_link>`

#### 5. Make a new .env file

At minimum, the following is needed: 

```
SESSION_SECRET = 'This is a string for the session to use (like a salt)'
```

Optional others, including facebook specific ones: 

```
PORT = 3000
FACEBOOK_APP_ID = 123456789012345
FACEBOOK_APP_SECRET = '1234567890abcdef1234567890abcdef'
BASE_URL = 'http://localhost:3000'
```

#### 6. Customize with the new project's name

* Title in `layout.ejs`
* Logo and links in `nav.ejs`
* The name, description, and repo fields in `package.json`
* Remove the `README.md` content (this) and put a stub for the new project's readme

#### 7. Create a new database for the new project

```
createdb <new_database_name>
```

#### 8. Set up Sequelize

First, update the development settings in the `config/config.json` file.

```js
{
  "development": {
    "database": "<new_database_name>",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

```

(Optional) If additional fields on the user table are needed, follow directions [here](#adding-migrations) to create additional migrations.

Then, do the Sequelize migrations with this command:

```
sequelize db:migrate
```

#### 9. Run the server locally and ensure that it works

If you have `nodemon` installed globally, run `nodemon` as a command in the root folder.

Otherwise, run `node index.js`.

Unless specified otherwise, the port in use will be 3000.

#### 10. Commit and push to your new project

> Note: We switched the origin remote to point to the new github project in step 4. Make sure that this is done properly bu checking the command `git remote-v` to check the remote locations.

```
git add -A
git commit -m "Initial commit"
git push origin master
```

#### 11. Next Steps

Assuming that the set-up steps went smoothly, now you can add new models/migrations, new controllers and routes, etc., and just generally start developing as if you had started from scratch.

## Notes on Optional Steps

### Adding Migrations

Here is an example of adding an `age` field to the user table

* STEP 1: Creat a migration file via sequelize in the command line
	* `sequelize migration:create --name add-age`
* STEP 2: Write the up and down functions of the migration
	* Refer to other migrations for how this looks
	* `return queryInterface.addColumn('users', 'age', Sequelize.INTEGER)`
* STEP 3: Add the column into the user model
	* `user.js` - located in the models folder

### Facebook App Set Up 

> Note: A Facebook login is required

* Go to developers.facebook.com
* Create a new app
* Add a platform: website
* Add a product: Facebook login
	* Set Valid OAuth Redirect URL to `https://yoursite.com/auth/callback/facebook`

* Copy the App Id and App Secret to the `.env` file