const express = require('express');
const router = express.Router();
const { MovieDb } = require('moviedb-promise');

const Media = require('../../models/Media');

const movieDBIdSearch = async (id, type) => {
  const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

  try {
    if (type === "tv")
      return await moviedb.tvInfo(id);

    // if not tv it has to be a movie
    return await moviedb.movieInfo(id);
  } catch (e) {
    return e;
  }

}

const movieDBPopularitySearch = async (type) => {
  const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);
  
  try {
    if (type === 'tv')
      return await moviedb.tvPopular();
    
    // if not tv it has to be a movie
    return await moviedb.moviePopular();
  } catch (e) {
    return {
      message: "Something went wrong with the search.",
      name: "Application error"
    };
  }
}

const movieDBSearch = async ({ query: { search, searchFor } }) => {
  const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);
  const params = {
    query: search,
    include_adult: false,
  };

  switch (searchFor) {
    case "all": {
      try {
        return await moviedb.searchMulti(params);
      } catch (e) {
        return e;
      }
    }
    case "tv": {
      try {
        return await moviedb.searchTv(params);
      } catch (e) {
        return e;
      }
    }
    case "movie": {
      try {
        return await moviedb.searchMovie(params);
      } catch (e) {
        return e;
      }
    }
    default: {
      return {
        message: "Something went wrong with the search.",
        name: "Application error"
      }
    }
  }
}

const databaseSearch = async ({ query: { search, searchFor } }) => {
  try {
    if (searchFor === 'tv')
      return await Media.find({ title: { $regex: search, $options: 'i' }, media_type: 'tv' }).populate('lists').limit(20);
    if (searchFor === 'movie')
      return await Media.find({ title: { $regex: search, $options: 'i' }, media_type: 'movie' }).populate('lists').limit(20);

    // if neither tv or movie, must be all
    return await Media.find({ title: { $regex: search, $options: 'i' } }).populate('lists').limit(20);
  } catch (e) {
    return e;
  }
}

const mediaSearch = async (id) => {
  try {
    return await Media.findById(id).populate('lists');
  } catch (e) {
    return e;
  }
}

// Create new media item
router.post('/:id', async (req, res) => {
  let media = await Media.findOne({ moviedb_id: req.params.id });
  if (media) return res.send(media);

  const result = await movieDBIdSearch(req.params.id, req.body.media_type);

  let newMedia = new Media({
    moviedb_id: parseInt(req.params.id),
    title: result.name || result.title,
    overview: result.overview,
    poster_path: result.poster_path,
    media_type: req.body.media_type,
    release_date: result.first_air_date || result.release_date || null,
    status: result.status,
    number_of_seasons: result.number_of_seasons || null,
    number_of_episodes: result.number_of_episodes || null,
    last_air_date: result.last_air_date || null,
    last_attempted_update: Date.now(),
    lists: []
  });

  await newMedia.save();

  return res.send(newMedia);
});

router.get('/popular', async (req, res) => {
  const { type } = req.query;
  const result = await movieDBPopularitySearch(type);
  res.send(result);
});

// Update media item
router.put('/:id', async (req, res) => {
  const info = req.body;

  const result = await movieDBIdSearch(info.moviedb_id, info.media_type);

  let updated = await Media.findOneAndUpdate({ _id: info._id }, {
    moviedb_id: info.moviedb_id,
    title: result.name || result.title,
    overview: result.overview,
    poster_path: result.poster_path,
    media_type: info.media_type,
    release_date: result.first_air_date || result.release_date || null,
    status: result.status,
    number_of_seasons: result.number_of_seasons || null,
    number_of_episodes: result.number_of_episodes || null,
    last_air_date: result.last_air_date || null,
  }, { new: true });

  return res.send(updated);
  // return res.send(result);
});

// Search for media from database to go to media page
router.get('/:id', async (req, res) => {
  const result = await mediaSearch(req.params.id);

  // error
  if (result.message) {
    return res.send({
      message: result.message,
      name: result.name,
    });
  }

  return res.send(result);
});

// Used for search page search functionality
router.get('/', async (req, res) => {
  if (req.query.searchLocation === "database") {
    const result = await databaseSearch(req);
    return res.send(result);
  }

  // If not from database, has to be from moviedb
  const result = await movieDBSearch(req);
  return res.send(result);
});

module.exports = router;