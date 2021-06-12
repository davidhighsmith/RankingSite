import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';
import SearchBar from '../SearchBar/SearchBar';
import ListCard from '../ListCard/ListCard';
import './AllLists.css';
import { instance as axios } from '../../utils/axios';

const AllLists = () => {
  const [search, setSearch] = useState('');
  const [searchFor, setSearchFor] = useState('title');
  const [searching, setSearching] = useState(false);
  const [lists, setLists] = useState([]);

  const updateSearch = (e) => {
    e.preventDefault();

    if (e.target.value === '') {
      setLists([]);
      setSearch(e.target.value);
      return;
    }

    if (!searching) {
      setSearching(true);
      axios.get('/api/lists/search', {
        params: {
          search: e.target.value,
          searchFor
        }
      })
      .then(res => {
        setLists(res.data);
      })
      .catch(error => {
        console.log(error);
      });
      setSearching(false);
    }

    setSearch(e.target.value);
    }

  const submit = (e) => {
    e.preventDefault();
  }

  return (
    <div>
      <Nav active="lists" />
      <div className="list-page-container">
        <Link to="/lists/new" className="list-page-new-list-button">+ New List</Link>
        <div className="list-search-container">
          <h3 className="list-search-header">Search Lists</h3>
          <div className="list-search-buttons">
            <button className={`list-search-button ${searchFor === 'title' ? 'list-search-button-active' : ''}`} onClick={() => setSearchFor('title')}>Title</button>
            <button className={`list-search-button ${searchFor === 'subtitle' ? 'list-search-button-active' : ''}`} onClick={() => setSearchFor('subtitle')}>Subtitle</button>
          </div>
          <SearchBar search={search} updateSearch={updateSearch} submit={submit} />
        </div>

        <div className="recently-updated-list all-lists-page">
          {
          <>
            {lists.map(list => <ListCard id={list._id} title={list.title} subtitle={list.subtitle} updated={list.updatedAt} key={list._id} />)}
          </>
          }
        </div>

      </div>
    </div>
  )
};

export default AllLists;
