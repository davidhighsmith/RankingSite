const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Add backdrop_path for movies so they can be in lists with tv show episodes
const MediaSchema = new Schema(
  {
    moviedb_id: Number,
    title: String,
    overview: String,
    poster_path: String,
    media_type: String,
    release_date: String,
    status: String,
    number_of_seasons: Number,
    number_of_episodes: Number,
    last_air_date: String,
    lists: [{
      type: Schema.Types.ObjectId, ref: 'List'
    }]
  },
  {
    timestamps: true
  }
);

module.exports = Media = mongoose.model('Media', MediaSchema);