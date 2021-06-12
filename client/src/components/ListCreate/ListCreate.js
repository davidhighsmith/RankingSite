import { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Select from 'react-select';
import _ from 'lodash';
import Nav from '../Nav/Nav';
import listTypes from '../../utils/listTypes';
import { instance as axios } from '../../utils/axios';
import './ListCreate.css';

const ListCreate = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [listType, setListType] = useState('');
  const [info, setInfo] = useState({});
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const history = useHistory();
  const { state } = location;

  useEffect(() => {
    if (state) {
      setInfo(state.info);
      setListType(state.listType);
      setSeasonOptions(state.seasonOptions);
      setSelectedSeason(state.selectedSeason);
      setRedirected(true);
    }
    setLoading(false);
  }, [state]);

  // TODO: Redirect to info page for new list after creation
  const submitForm = async (e) => {
    e.preventDefault();

    // TODO: selectedSeason for movies would be set to null
    if (selectedSeason === null) return;

    const newInfo = _.cloneDeep(info);
    if (title !== '') newInfo.title = title.replace(/\s+/g, ' ').trim();
    newInfo.subtitle = subtitle.replace(/\s+/g, ' ').trim();
    newInfo.description = description.replace(/\s+/g, ' ').trim();

    const options = {
      listType,
      selectedSeason: parseInt(selectedSeason.value),
    }

    const { data } = await axios.post(`/api/lists`, { info: newInfo, options });
    console.log(data);
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

  const onTitleChange = (e) => setTitle(e.target.value);
  const onSubtitleChange = (e) => setSubtitle(e.target.value);
  const descriptionChange = (e) => setDescription(e.target.value);
  const seasonChange = (option) => setSelectedSeason(option);

  return (
    <div>
      <Nav active="lists" />
      {loading ? null :
        <div className="list-create-form-container">
          <form className="list-create-form" onSubmit={submitForm}>
            <div className="list-create-form-input-container">
              {getListTypes()}
              <label htmlFor="list-create-form-title">Title</label>
              <input type="text" name="title" id="list-create-form-title" className="list-create-form-text-input" value={redirected ? info.title : title} disabled={redirected} onChange={onTitleChange} />
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
            <div className="list-create-form-input-container">
              <button type="submit" className="list-create-form-submit">Create</button>
            </div>
          </form>
        </div>
      }
    </div>
  )
};

export default withRouter(ListCreate);
