import { useState, useEffect } from 'react';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import dateFormat from 'dateformat';
import { baseImage } from '../../utils/theMovieDBBaseURL';
import placeholder from '../../images/placeholder-600x900.jpg';
import Nav from '../Nav/Nav';
import MediaLists from '../MediaLists/MediaLists';
import MediaCreateList from '../MediaCreateList/MediaCreateList';
import './Media.css';
import { instance as axios } from '../../utils/axios';
import listTypes from '../../utils/listTypes';

const Media = ({ location }) => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const [returnTo, setReturnTo] = useState(false);
  const [search, setSearch] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchFor, setSearchFor] = useState('');
  const [openTab, setOpenTab] = useState('lists');
  const [listItems, setListItems] = useState([]);
  const [reload, setReload] = useState(false);

  const { id } = useParams();
  const history = useHistory();
  const { state } = location;

  useEffect(() => {
    if (state) {
      if (state.properties) {
        setReturnTo(true);
        setSearch(state.lastSearch.search);
        setSearchLocation(state.lastSearch.searchLocation);
        setSearchFor(state.lastSearch.searchFor);
        setListItems(state.listItems);
        setInfo(state.properties);
        setLoading(false);
        history.replace(location.pathname, '');
        return;
      }

      if (state.data) {
        setInfo(state.data);
        setLoading(false);
        history.replace(location.pathname, '');
        return;
      }
    }

    const getInfo = async () => {
      const { data } = await axios.get(`/api/media/${id}`);
      setInfo(data);
    }

    // TODO: getInfo returns a message and name if there is no id
    //       Create an error page for that
    getInfo();
    setLoading(false);
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [state]);

  const returnToSearch = () => {
    history.push({
      pathname: '/media',
      state: { listItems, search, searchLocation, searchFor, searchPopularity: '', reload }
    });
  }

  const createYear = (type) => {
    if (type === 'tv')
      return `(${dateFormat(info.release_date, "yyyy")} - ${info.status === 'Ended' || info.status === 'Canceled' ? dateFormat(info.last_air_date, "yyyy") : "Present"})`;
    
    // movie
    return `(${dateFormat(info.release_date, "yyyy")})`;
  }

  const updateInfo = async () => {
    const time = new Date();
    const lastUpdate = new Date(info.updatedAt);
    const timeDiff = Math.floor((time - lastUpdate) / 1000);

    // Don't update unless 5 seconds have passed since last update
    // TODO: Make an error message possibly?
    if (timeDiff >= 5) {
      const { data } = await axios.put(`/api/media/${id}`, info);
      setInfo(data);
      setReload(true);
    }
  }

  const newListButton = () => {
    if (info.media_type !== 'movie') {
      openTab === 'lists' ? setOpenTab("createList") : setOpenTab('lists');
      return;
    }

    history.push({
      pathname: '/lists/create',
      state: { info, listType: listTypes.MOVIE }
    });
  }

  return (
    <>
    {loading ? <div>Loading</div> : 
    <div>
      <Nav active="media" />
      <div className="media-page-container">

        <div className="media-page-left-container">
          {returnTo ? 
            <div className="media-return-to-search-container">
              <button className="media-return-to-search" onClick={returnToSearch}>Return to Search</button>
            </div>
            : null
          }
          <img src={`${info.poster_path ? `${baseImage}${info.poster_path}` : placeholder}`} alt={info.title} className="media-page-left-poster" />
        </div>

        <div className="media-page-right-container">
          <div className="media-page-right-title-container">
            <h2 className="media-page-right-title">{info.title}</h2>
            <h4 className="media-page-right-year">{createYear(info.media_type)}</h4>
          </div>
          <div className="media-page-right-description-container">
            <h4 className="media-page-right-description-header">Overview</h4>
            <p className="media-page-right-description">{info.overview}</p>
          </div>

          {info.media_type === "tv" ? (
            <div className="media-page-right-stats-container">
              <div className="media-page-right-stats">
                <h3 className="media-page-right-stats-count">{info.number_of_seasons}</h3>
                <h4 className="media-page-right-stats-title">Seasons</h4>
              </div>
              <div className="media-page-right-stats">
                <h3 className="media-page-right-stats-count">{info.number_of_episodes}</h3>
                <h4 className="media-page-right-stats-title">Episodes</h4>
              </div>
              <div className="media-page-right-stats" title="X days since last update.">
                <div className="media-page-right-time-container">
                  <h3 className="media-page-right-stats-date">{dateFormat(info.updatedAt, "UTC:m/d/yy")}</h3>
                  <h4 className="media-page-right-stats-time">{dateFormat(info.updatedAt, "h:MM:ss TT")}</h4>
                </div>
                <h4 className="media-page-right-stats-title">Last Updated</h4>
              </div>
            </div>
          ) : 
          (
            <div className="media-page-right-stats-container movie">
              <div className="media-page-right-stats">
                <h3 className="media-page-right-stats-count">{dateFormat(info.release_date, "UTC:mmmm d, yyyy")}</h3>
                <h4 className="media-page-right-stats-title">Released</h4>
              </div>
              <div className="media-page-right-stats" title="X days since last update.">
                <div className="media-page-right-time-container">
                  <h3 className="media-page-right-stats-date">{dateFormat(info.updatedAt, "UTC:m/d/yy")}</h3>
                  <h4 className="media-page-right-stats-time">{dateFormat(info.updatedAt, "h:MM:ss TT")}</h4>
                </div>
                <h4 className="media-page-right-stats-title">Last Updated</h4>
              </div>
            </div>
          )}
          

          <div className="media-page-right-button-center-container">
            <div className="media-page-right-button-container">
              <button className="media-page-right-button" onClick={newListButton}>{ openTab === 'lists' ? 'New List' : 'Lists' }</button>
              <button className="media-page-right-button">Add to List</button>
              <button className="media-page-right-button" onClick={updateInfo}>Update</button>
            </div>
          </div>

          <div className="media-page-right-bottom-outer-container">
            {openTab === "lists" ? <MediaLists lists={info.lists} /> : null}
            {openTab === "createList" ? <MediaCreateList info={info} /> : null}
          </div>

        </div>
      </div>
    </div>
    }
    </>
  )
};

export default withRouter(Media);
