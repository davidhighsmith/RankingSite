import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';
import { baseImage } from '../../utils/theMovieDBBaseURL';
import placeholder from '../../images/placeholder-600x900.jpg';
import './MediaSearchItem.css';

const MediaSearchItem = ({ properties, sendToTempPage, sendToMediaPage }) => {
  const { id, poster_path, title, name, first_air_date, release_date, original_title, original_name, _id } = properties;
  
  const listItem = () => {
    let item;

    // would mean data is coming from themoviedb
    if (original_title || original_name) {
      const itemTitle = original_title !== undefined ? title : name;
      const poster = poster_path ? `${baseImage}${poster_path}` : placeholder;

      let year;
      if (release_date || first_air_date) {
        year = release_date ? dateFormat(release_date, "yyyy") : dateFormat(first_air_date, "yyyy");
      }

      item = (
        <Link to={`/media/temp/${id}`} className="media-search-item" onClick={(e) => sendToTempPage(e, properties)}>
        <img src={poster} alt={itemTitle} className="media-search-item-img" />
        <div className="media-search-item-info-container">
          <div className="media-search-item-info">
            <h3 className="media-search-item-title">{itemTitle}</h3>
            { !isNaN(year) ? <h4 className="media-search-item-year">({year})</h4> : null }
          </div>
        </div>
      </Link>
      );

      return item;
    }
    
    // Data coming from database
    item = (
      <Link to={`/media/${_id}`} className="media-search-item" onClick={(e) => sendToMediaPage(e, properties)}>
        <img src={`${poster_path ? `${baseImage}${poster_path}` : placeholder}`} alt={title} className="media-search-item-img" />
        <div className="media-search-item-info-container">
          <div className="media-search-item-info">
            <h3 className="media-search-item-title">{title}</h3>
            <h4 className="media-search-item-year">({dateFormat(release_date, "yyyy")})</h4>
          </div>
        </div>
      </Link>
    );

    return item;
  }

  

  return listItem();
};

export default MediaSearchItem;
