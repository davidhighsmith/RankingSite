import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import "./MediaCreateList.css";
import listTypes from '../../utils/listTypes';

const ListCreate = ({ info }) => {
  const [loading, setLoading] = useState(true);
  const [listType, setListType] = useState('');
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);

  const history = useHistory();

  useEffect(() => {
    if (info.media_type === 'tv') {
      let tempArr = [];
      for (let i = 1; i <= info.number_of_seasons; i++) {
        tempArr.push({ value: `${i}`, label: `Season ${i}` });
      }
      setSeasonOptions(tempArr);
      setLoading(false);
      return;
    }
  }, [info]);

  const goToListCreate = (e) => {
    history.push({
      pathname: '/lists/create',
      state: { info, listType, seasonOptions, selectedSeason }
    });
  }

  const seasonChange = (option) => setSelectedSeason(option);

  // TODO: Movie is not setup
  const setOptions = () => {
    if (info.media_type === 'tv') {
      const tvsssse = listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES;
      const tvsse = listTypes.TV_SINGLE_SHOW_EPISODES;
      const tvsss = listTypes.TV_SINGLE_SHOW_SEASONS;

      return (
        <div className="list-options-button-container">
          <div className={`media-search-button ${listType === `${tvsssse}` ? 'media-search-button-active' : ''}`} onClick={() => setListType(tvsssse)}>{tvsssse}</div>
          <div className={`media-search-button ${listType === `${tvsse}` ? 'media-search-button-active' : ''}`} onClick={() => setListType(tvsse)}>{tvsse}</div>
          <div className={`media-search-button ${listType === `${tvsss}` ? 'media-search-button-active' : ''}`} onClick={() => setListType(tvsss)}>{tvsss}</div>
        </div>
      );
    }
  }

  return (
    <>
    { loading ? null :
      <div className="media-page-right-create-list-container">
        <div className="media-page-right-create-list">
          { info.media_type === 'tv' ? 
            <>
              {setOptions()}
              { listType === listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES ?
                <Select className="media-page-right-create-list-select" classNamePrefix="media-page-right-create-list-select" isSearchable={false} value={selectedSeason} onChange={seasonChange} options={seasonOptions} placeholder="Choose Season" /> : null
              }
            </> 
            : null }
          <button className="media-page-right-create-list-submit media-page-right-button" type="submit" onClick={goToListCreate} disabled={listType === listTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES && selectedSeason === null ? true : false}>Create</button>
        </div>
      </div>
    }
    </>
  )
};

export default ListCreate;
