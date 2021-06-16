import { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import _ from 'lodash';
import SearchBar from '../SearchBar/SearchBar';
import Nav from '../Nav/Nav';
import MediaSearchItem from '../MediaSearchItem/MediaSearchItem';
import './AllMedia.css';
import { instance as axios } from '../../utils/axios';

const AllMedia = ({ location }) => {
  const [search, setSearch] = useState('');
  const [searchLocation, setSearchLocation] = useState('database');
  const [searchFor, setSearchFor] = useState('all');
  const [searchPopularity, setSearchPopularity] = useState('');
  const [lastSearch, setLastSearch] = useState({
    search: '',
    searchLocation: '',
    searchFor: '',
    searchPopularity: ''
  });
  const [listItems, setListItems] = useState([]);
  
  const history = useHistory();
  const { state } = location;

  useEffect(() => {
    // Reload data after item has been updated then moved back to search page
    // If this isn't done then there is a flash on the last updated time
    const basicSearch = async (search, searchLocation, searchFor, searchPopularity) => {
      const { data } = await axios.get('/api/media', {
        params: {
          search,
          searchLocation,
          searchFor,
          searchPopularity
        }
      });
      setListItems(data);
    }

    if (state) {
      setSearchPopularity(state.searchPopularity);
      setSearch(state.search);
      setSearchLocation(state.searchLocation);
      setSearchFor(state.searchFor);
      setListItems(state.listItems);
      setLastSearch({
        search: state.search,
        searchLocation: state.searchLocation,
        searchFor: state.searchFor,
        searchPopularity: state.searchPopularity
      })
      
      if (state.reload) 
        basicSearch(state.search, state.searchLocation, state.searchFor);
    }
    history.replace(location.pathname, '');
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const sendToTempPage = (e, properties) => {
    e.preventDefault();
    history.push({
      pathname: `/media/temp/${properties.id}`,
      state: { properties, listItems, lastSearch }
    });
  }

  const sendToMediaPage = (e, properties) => {
    e.preventDefault();
    history.push({
      pathname: `/media/${properties._id}`,
      state: { properties, listItems, lastSearch }
    })
  }

  const updateSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  }

  const filterPeople = (data) => {
    const filtered = [];
    data.forEach(d => { if (d.media_type !== "person") filtered.push(d) });
    return filtered;
  }

  const getPopularity = async (type) => {
    if (searchPopularity === type) {
      setSearchPopularity('');
      return;
    }

    if (lastSearch.searchPopularity === type) {
      setSearchPopularity(type);
      return;
    }

    const { data } = await axios.get('/api/media/popular', {
      params: {
        type
      }
    });

    setLastSearch({
      search,
      searchLocation,
      searchFor,
      searchPopularity: type
    })
    setListItems(data.results);
    setSearchPopularity(type);
  }

  const handleSetSearchLocation = (location) => {
    if (location === 'database' && searchPopularity !== '')
      setSearchPopularity('');

    if (location === 'themoviedb' && lastSearch.searchPopularity !== '')
      setSearchPopularity(lastSearch.searchPopularity);

    setSearchLocation(location);
  }

  const submit = async (e) => {
    if (e !== '') e.preventDefault();
    if (search.trim().length === 0) return;

    const lastSearchNoPop = {
      search: lastSearch.search,
      searchLocation: lastSearch.searchLocation,
      searchFor: lastSearch.searchFor
    }
  
    const checkObj = {
      search,
      searchLocation,
      searchFor,
    }

    if (_.isEqual(lastSearchNoPop, checkObj)) return;

    const { data } = await axios.get('/api/media', {
      params: {
        search,
        searchLocation,
        searchFor,
      }
    });

    // TODO: Something with this error
    //       data.message and data.name will contain an error
    if (data.message) {
      console.log(data.message);
      return;
    }

    setLastSearch({
      ...checkObj,
      searchPopularity: '',
    });
    if (searchFor === 'all' && searchLocation === 'themoviedb') {
      setListItems(filterPeople(data.results));
      return;
    }

    if (searchLocation === 'themoviedb')
      setListItems(data.results);
    else
      setListItems(data);
  }

  const createList = () => {
    let sorted, list;
    // MovieDB Standard Search
    if (lastSearch.searchLocation === 'themoviedb' && lastSearch.searchPopularity === '') {
      sorted = _.sortBy(listItems, "popularity").reverse();
      list = sorted.map((item) => <MediaSearchItem properties={item} sendToTempPage={sendToTempPage} key={item.id} />)
    }
    // MovieDB Popularity Search
    else if (lastSearch.searchPopularity !== '') {
      list = listItems.map((item) => <MediaSearchItem properties={item} sendToTempPage={sendToTempPage} key={item.id} popularity={true} />)
    }
    // Database Search
    else {
      list = listItems.map((item) => <MediaSearchItem properties={item} sendToMediaPage={sendToMediaPage} key={item._id} />)
    }



    return list;
  }

  return (
    <div>
      <Nav active="media" />
      <div className="media-top-container">
        <div className="media-search-container">
          <h3 className="media-search-header">Search Movies / Shows</h3>
          <div className="media-search-buttons-container">
            <h4 className="media-buttons-title">Where to Search</h4>
            <div className="media-search-buttons">
              <button className={`media-search-button ${searchLocation === 'database' ? 'media-search-button-active' : ''}`} onClick={() => handleSetSearchLocation('database')}>Database</button>
              <button className={`media-search-button ${searchLocation === 'themoviedb' ? 'media-search-button-active' : ''}`} onClick={() => handleSetSearchLocation('themoviedb')}>TheMovieDB</button>
            </div>
          </div>

          {searchLocation === 'themoviedb' && 
            <div className="media-search-buttons-container">
              <h4 className="media-buttons-title">Most Popular</h4>
              <div className="media-search-buttons">
                <button className={`media-search-button ${searchPopularity === 'tv' ? 'media-search-button-active' : ''}`} onClick={() => getPopularity('tv')}>Tv Shows</button>
                <button className={`media-search-button ${searchPopularity === 'movie' ? 'media-search-button-active' : ''}`} onClick={() => getPopularity('movie')}>Movies</button>
              </div>
            </div>
          }

          {searchPopularity === '' && 
          <>
            <div className="media-search-buttons-container">
              <h4 className="media-buttons-title">Type of Media</h4>
              <div className="media-search-buttons">
                <button className={`media-search-button ${searchFor === 'all' ? 'media-search-button-active' : ''}`} onClick={() => setSearchFor('all')}>All</button>
                <button className={`media-search-button ${searchFor === 'tv' ? 'media-search-button-active' : ''}`} onClick={() => setSearchFor('tv')}>TV Show</button>
                <button className={`media-search-button ${searchFor === 'movie' ? 'media-search-button-active' : ''}`} onClick={() => setSearchFor('movie')}>Movie</button>
              </div>
            </div>

            <SearchBar search={search} updateSearch={updateSearch} submit={submit} />
          </>
          }

        </div>
      </div>
      <div className="media-search-results-container">
        <div className="media-search-results">
          {createList()}
        </div>
      </div>

    </div>
  )
};

export default withRouter(AllMedia);
