const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema(
  {
    title: String,
    subtitle: String,
    description: String,
    list_type: String,
    media: [{
      type: Schema.Types.ObjectId, ref: 'Media'
    }],
    list: [{
      uuid: String,
      order: Number,
      title: String,
      overview: String,
      poster_path: String,
      still_path: String,
      rank: Number,
      media_id: String,
      season_number: Number,
      episode_number: Number,
    }]
  },
  {
    timestamps: true
  }
);

module.exports = List = mongoose.model('List', ListSchema);
