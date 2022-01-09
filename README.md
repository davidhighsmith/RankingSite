# Ranking Site

Site used to rank episodes of TV Shows or Movies.

This project is no longer being updated due to the main project it was made for no longer going forward.

Ranking lists for TV Shows currently works. Movie ranking lists can be created but cannot add or remove movies from the list once created.

***

### Environment Variables
 
 ***

 * MONGO_URI - Connection string for MongoDB
 * MOVIEDB_API_KEY - API key from TheMovieDB

 ***

 This project has many issues that would need to be corrected if I were to ever come back to it including:

 * Better state management (React Context or Redux). Currently passing state around React Router which has turned into a mess.
 * Database models need changed if it were to become a site more than one person uses to make lists.
 * Components have some repeated logic and some components seem to be much larger than they should be.
