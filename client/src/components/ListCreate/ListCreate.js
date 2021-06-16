import { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Select from 'react-select';
import _ from 'lodash';
import Nav from '../Nav/Nav';
import Modal from '../Modal/Modal';
import ListCreateSearch from '../ListCreateSearch/ListCreateSearch';
import listTypes from '../../utils/listTypes';
import { instance as axios } from '../../utils/axios';
import './ListCreate.css';

const ListCreate = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [listType, setListType] = useState('');
  const [info, setInfo] = useState([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const { state } = location;

  useEffect(() => {
    if (state) {
      let arr = [];
      arr.push({...state.info});
      setInfo(arr);
      setListType(state.listType);
      if (state.info.media_type !== 'movie') {
        setSeasonOptions(state.seasonOptions);
        setSelectedSeason(state.selectedSeason);
      }
      setRedirected(true);
    }
    setLoading(false);
  }, [state]);

  // TODO: Redirect to info page for new list after creation
  const submitForm = async (e) => {
    e.preventDefault();

    if (info.length === 0) return;

    // TODO: selectedSeason for movies would be set to null
    if (listType === listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES && selectedSeason === null) return;

    console.log(info);

    const listInfo = {};
    listInfo.items = _.cloneDeep(info);
    if (title !== '') listInfo.title = title.replace(/\s+/g, ' ').trim();
    else listInfo.title = info[0].title;
    listInfo.subtitle = subtitle.replace(/\s+/g, ' ').trim();
    listInfo.description = description.replace(/\s+/g, ' ').trim();

    const options = {
      listType,
      selectedSeason: selectedSeason === null ? null : parseInt(selectedSeason.value),
    }

    console.log('newInfo:', listInfo);
    console.log('options:', options);

    const { data } = await axios.post(`/api/lists`, { info: listInfo, options });

    console.log(data);
    // history.push({
    //   pathname: `/lists/${data._id}/info`, 
    //   state: {
    //     listItems: data.list,
    //     topBannerInfo: { title: data.title, subtitle: data.subtitle },
    //     description: data.description,
    //     listType: data.list_type,
    //     media: data.media,
    //     updatedItems: data.updatedItems,
    //   }
    // });
  }

  const getListTypes = () => {
    if (info.media_type === 'tv') {
      const tvsssse = listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES;
      const tvsse = listTypes.TV_SINGLE_SHOW_EPISODES;
      const tvsss = listTypes.TV_SINGLE_SHOW_SEASONS;

      return (
        <div className="list-options-button-container list-create">
          <div className={`media-search-button ${listType === `${tvsssse}` ? 'media-search-button-active' : ''}`} onClick={() => setListType(tvsssse)}>{tvsssse}</div>
          <div className={`media-search-button ${listType === `${tvsse}` ? 'media-search-button-active' : ''}`} onClick={() => setListType(tvsse)}>{tvsse}</div>
          <div className={`media-search-button ${listType === `${tvsss}` ? 'media-search-button-active' : ''}`} onClick={() => setListType(tvsss)}>{tvsss}</div>
        </div>
      );
    }
  }

  const getDisableTitle = () => {
    if (listType === listTypes.MOVIE) return false;
    if (listType === listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES) return true;
    
    return true;
  }
  const disableTitle = getDisableTitle();

  const onSearchChange = async (e) => {
    setSearch(e.target.value);
    // TODO: Make search hit both moviedb and main database
    //       to make it easier to add items to lists
    if (listType === listTypes.MOVIE) {
      let { data } = await axios.get('/api/media', {
        params: {
          search: e.target.value,
          searchFor: 'movie',
          searchLocation: 'database',
        }
      });
      console.log(data);
      setSearchResults(data);
    }
  }

  const addToList = (item) => {
    let newInfo = _.cloneDeep(info);
    newInfo.push(item);
    setInfo(newInfo);
  }

  const removeFromList = (item) => {
    let newInfo = _.cloneDeep(info);
    let index;
    for (let i = 0; i < newInfo.length; i++) {
      if (newInfo[i].moviedb_id === item.moviedb_id) {
        index = i;
        break;
      }
    }

    if (typeof index !== "undefined") {
      newInfo.splice(index, 1);
      setInfo(newInfo);
    }
  }

  const closeModal = (e) => {
    if (e.target.dataset.modal) setShowModal(false);
  }

  const onTitleChange = (e) => setTitle(e.target.value);
  const onSubtitleChange = (e) => setSubtitle(e.target.value);
  const descriptionChange = (e) => setDescription(e.target.value);
  const seasonChange = (option) => setSelectedSeason(option);

  return (
    <div>
      <Nav active="lists" />
      {loading ? null :
        <>
          <Modal showModal={showModal} closeModal={closeModal}>
            <ListCreateSearch 
              info={info}
              search={search}
              onSearchChange={onSearchChange}
              searchResults={searchResults}
              addToList={addToList}
              removeFromList={removeFromList}
            />
          </Modal>
          <div className="list-create-form-container">
            <form className="list-create-form" onSubmit={submitForm}>
              <div className="list-create-form-input-container">
                {getListTypes()}
                <label htmlFor="list-create-form-title">Title</label>
                <input type="text" name="title" id="list-create-form-title" className="list-create-form-text-input" value={redirected && disableTitle ? info[0].title : title} disabled={disableTitle} onChange={onTitleChange} />
              </div>
              <div className="list-create-form-input-container">
                <label htmlFor="list-create-form-subtitle">Subtitle</label>
                <input type="text" name="subtitle" id="list-create-form-subtitle" className="list-create-form-text-input" value={subtitle} onChange={onSubtitleChange} />
              </div>
              { listType === listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES ?
                (
                <div className="list-create-form-dropdown">
                  <Select className="media-page-right-create-list-select" classNamePrefix="media-page-right-create-list-select" isSearchable={false} value={selectedSeason} onChange={seasonChange} options={seasonOptions} placeholder="Choose Season" />
                </div>
                ) : null
              }
              <div className="list-create-form-input-container">
                <label htmlFor="list-create-form-description">Description</label>
                <textarea className="list-create-form-textarea" id="list-create-form-description" onChange={descriptionChange} />
              </div>

              {listType === listTypes.MOVIE &&
                <div className="list-create-form-input-container">
                  <div className="list-create-form-add-items" onClick={() => setShowModal(true)}>Add Items</div>
                </div>
              }
              
              <div className="list-create-form-input-container">
                <button type="submit" className="list-create-form-submit" disabled={info.length === 0}>Create</button>
              </div>
            </form>
          </div>
        </>
      }
    </div>
  )
};

export default withRouter(ListCreate);
