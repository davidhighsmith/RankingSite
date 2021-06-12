const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { MovieDb } = require('moviedb-promise');
const listTypes = require('../../config/listTypes');

const List = require('../../models/List');
const Media = require('../../models/Media');

const getSeasonEpisodes = async (moviedb_id, season) => {
  const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

  try {
    return await moviedb.seasonInfo({ id: moviedb_id, season_number: season })
  } catch (e) {
    return e;
  }
}

// Remove unneeded items in moviedb response, add uuid
const createSeasonEpisodeList = (episodes, media_id) => {
  const episodeList = [];

  episodes.forEach((episode, index) => {
    episodeList.push({
      uuid: uuidv4(),
      order: index + 1,
      title: episode.name,
      overview: episode.overview,
      poster_path: null,
      still_path: episode.still_path,
      rank: null,
      media_id: media_id,
      season_number: episode.season_number,
      episode_number: episode.episode_number,
    })
  })

  return episodeList;
}

const listSearchById = async (id) => {
  try {
    return await List.findById(id).populate([{
      path: 'media',
      model: 'Media',
		  populate: {
		    path: 'lists',
			  model: 'List',
		  }
    },
  ]);
  } catch (e) {
    return e;
  }
}

const listSearchByValue = async (search, searchFor) => {
  try {
    if (searchFor === 'title')
      return await List.find({ title: { $regex: search, $options: 'i' } });

    return await List.find({ subtitle: { $regex: search, $options: 'i' } });
  } catch (e) {
    return e;
  }
}

const getAllLists = async () => {
  try {
    return await List.find({}).sort({ updatedAt: 'desc' });
  } catch (e) {
    return e;
  }
}

const saveList = async (id, newList) => {
  try {
    const currList = await List.findById(id);
    currList.list.forEach((_, index) => {
      currList.list[index].rank = newList[index].rank;
    });
    currList.save();
    return { save: true, error: null }
  } catch(e) {
    return { save: false, error: e }
  }
}

// List search
router.get('/search', async (req, res) => {
  const { search, searchFor } = req.query;
  const result = await listSearchByValue(search, searchFor);
  res.send(result);
});

// update list
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const newList = req.body;
  const result = await saveList(id, newList);
  res.send(result);
});

// get a list
router.get('/:id', async (req, res) => {
  const result = await listSearchById(req.params.id);

  // error
  if (result.message) {
    return res.send({
      message: result.message,
      name: result.name,
    });
  }

  return res.send(result);
});

// Gets all lists
router.get('/', async (req, res) => {
  const result = await getAllLists();

  // error
  if (result.message) {
    return res.send({
      message: result.message,
      name: result.name,
    });
  }

  return res.send(result);
});

// Create new lists
router.post('/', async (req, res) => {
  const { info } = req.body;
  const { options } = req.body;

  if (options.listType === 
      listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES) {
    const data = await getSeasonEpisodes(info.moviedb_id, options.selectedSeason);
  
    let newList = new List({
      title: info.title,
      subtitle: info.subtitle !== '' ? info.subtitle : `Season ${options.selectedSeason}` ,
      description: info.description !== '' ? info.description : `List for season ${options.selectedSeason} of ${info.title}.`,
      list_type: listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES,
      media: [info._id],
      list: createSeasonEpisodeList(data.episodes, info._id),
    });

    const media = await Media.findById(info._id);
    media.lists.push(newList._id);

    await newList.save();
    await media.save();
  
    return res.send(newList);
  }

  return res.send(`${options.listType} not implemented`);
});

module.exports = router;