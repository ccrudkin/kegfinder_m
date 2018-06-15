# kegfinder_m
A brewery-focused web app to track beer kegs and provide inventory information and production analytics. Prototyped on a SQLite database, this version has been refactored to run on MongoDB in order to provide flexibility and ease of future scaling.

### Features 
Includes keg inventory building, tracking, and modification. Keg information data fields include:
- Keg ID
- initialized date
- keg condition
- keg type
- batch ID
- contents/style
- notes
- last change date

***

More information about usage can be found on the app's [Help page](https://kegfinder.herokuapp.com/help). Feel free to make an account and mess around with the functionality.

User login/registration system provides access to view and modify a specific user's inventory of kegs.

Kegfinder is currently [live for testing on Heroku](https://kegfinder.herokuapp.com).

