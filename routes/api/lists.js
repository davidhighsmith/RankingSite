const express = require('express');
const router = express.Router();
const _ = require('lodash');
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

const updateListInfoSingleSeason = async (media, listItems, listId) => {
  const season = listItems[0].season_number;
  const moviedb_id = media[0].moviedb_id;
  const media_id = listItems[0].media_id;
  const compareItems = listItems.map(({ _id, ...others }) => others);

  const newSeasonInfo = await getSeasonEpisodes(moviedb_id, season);
  const newEpisodes = newSeasonInfo.episodes;
  const newList = [];

  const listLength = listItems.length;

  newEpisodes.forEach((item, index) => {
    let rank;
    if (listLength > index) rank = listItems[index].rank;
    else rank = null;

    newList.push({
      order: index + 1,
      title: item.name,
      overview: item.overview,
      poster_path: null,
      still_path: item.still_path,
      rank,
      media_id: media_id,
      season_number: item.season_number,
      episode_number: item.episode_number,
    });
  });

  // Update list if current list and new list aren't equal
  if (!_.isEqual(compareItems, newList)) {
    const updatedList = await List.findOneAndUpdate({_id: listId}, {
      $set: {
        updated_items: Date.now(),
        list: newList,
      }
    }, {
      new: true,
    });
    return [updatedList, true];
  }

  // not equal, update time for last updated items and return false
  const updatedList = await List.findOneAndUpdate({_id: listId}, {
    $set: {
      updated_items: Date.now(),
    }
  }, {
    new: true,
  });
  return [updatedList, false];
}

// List search
router.get('/search', async (req, res) => {
  const { search, searchFor } = req.query;
  const result = await listSearchByValue(search, searchFor);
  return res.send(result);
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { media, listType, listItems } = req.body;

  // Single season list
  if (listType === listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES) {
    const [updatedList, updated] = await updateListInfoSingleSeason(media, listItems, id);
    return res.send({ updatedList, updated });
  }
  return res.send('List type hasn\'t been implemented yet.');
});

// update list, rankings change
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
      updated_items: Date.now(),
      media: [info._id],
      list: createSeasonEpisodeList(data.episodes, info._id),
    });

    const media = await Media.findById(info._id);
    media.lists.push(newList._id);

    await newList.save();
    await media.save();

    // TODO: cut out unneeded info from media items 
    newList.media = [media];

    return res.send(newList);
  }

  return res.send(`${options.listType} not implemented`);
});

module.exports = router;