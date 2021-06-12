import { withRouter, Redirect, useHistory } from 'react-router-dom';
import dateFormat from 'dateformat';
import { baseImage } from '../../utils/theMovieDBBaseURL';
import placeholder from '../../images/placeholder-600x900.jpg';
import Nav from '../Nav/Nav';
import './TempMedia.css';
import { instance as axios } from '../../utils/axios';

const TempMedia = ({location: { state }}) => {
  const { first_air_date, name, overview, poster_path, media_type, title, release_date, id } = state.properties;
  const { listItems } = state;
  const { search, searchLocation, searchFor, searchPopularity } = state.lastSearch;
  const history = useHistory();

  const returnToSearch = () => {
    console.log(searchPopularity);
    history.push({
      pathname: '/media',
      state: { listItems, search, searchLocation, searchFor, searchPopularity }
    });
  }

  const setPoster = () => {
    if (poster_path === null) return placeholder;
    return `${baseImage}${poster_path}`;
  }

  let media;
  if (media_type) media_type === "tv" ? media = "TV Show" : media = "Movie";
  else if (searchPopularity !== '') searchPopularity === "tv" ? media = "TV Show" : media = "Movie";
  else searchFor === "tv" ? media = "TV Show" : media = "Movie";

  let year;
  if (release_date)
    year = dateFormat(release_date, "yyyy");
  if (first_air_date)
    year = dateFormat(first_air_date, "yyyy");

  const addToDatabase = async () => {
    const { data } = await axios.post(`/api/media/${id}`, {
      media_type: media_type || searchFor,
    });

    history.push({
      pathname: `/media/${data._id}`,
      state: { data }
    });
  }

  return (
    <>
      {!state ? <Redirect to="/media" /> :
      <div>
        <Nav active="media" />
        <div className="media-page-container">

          <div className="media-page-left-container">
            <div className="media-return-to-search-container">
              <button className="media-return-to-search" onClick={returnToSearch}>Return to Search</button>
            </div>
            <img src={setPoster()} alt={name || title} className="media-page-left-poster" />
          </div>

          <div className="media-page-right-container">
            <div className="media-page-right-title-container">
              <h2 className="media-page-right-title">{name || title}</h2>
              { !isNaN(year) ? <h4 className="media-page-right-year">({year})</h4> : null }
            </div>
            <div className="media-page-right-description-container">
              <h4 className="media-page-right-description-header">Overview</h4>
              <p className="media-page-right-description">{overview}</p>
            </div>
            <div className="media-page-right-description-container temp-page">
              <h4 className="media-page-right-description-header">Media Type</h4>
              <p className="media-page-right-description">{media}</p>
            </div>

            <div className="temp-page-add-button-container">
              <button className="temp-page-add-button" onClick={addToDatabase}>Add to Database</button>
            </div>
          </div>
        </div>
      </div>
      }
    </>
  )
};

export default withRouter(TempMedia);
