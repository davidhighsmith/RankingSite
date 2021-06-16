import { useState, useRef, useEffect } from 'react';
import { baseImage } from '../../utils/theMovieDBBaseURL';
import placeholder from '../../images/placeholder-600x900.jpg';
import './ListCreateSearch.css';

const ListCreateSearch = ({ info, search, onSearchChange, searchResults, addToList, removeFromList }) => {
  const [show, setShow] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => { searchRef.current.focus(); }, []);

  return (
    <div className="list-create-search-container">
      <div className="list-create-search-area">
        <input type="text" className="list-create-search-input" ref={searchRef} value={search} onChange={onSearchChange} />
        <div className={`list-create-show-list-items ${show ? 'showing' : ''}`}>
          <button className="show-list-items-button" onClick={() => setShow(!show)} />
          <div className="show-list-items-count">
            <h3><span>{info.length}</span> Item{info.length !== 1 && 's'} in List</h3>
          </div>
        </div>
        { show &&
        <div className="show-list-items">
          { info.map(item => 
            <div className="show-list-item" key={item._id}>
              <div className="show-list-item-title">
                <h3 title={item.title}>{item.title}</h3>
              </div>
              <div className="show-list-item-remove" onClick={() => removeFromList(item)}>X</div>
            </div>
          )}
        </div>
        }
      </div>
      <div className="list-create-search-results-container">
        <div className="list-create-search-results">
          { searchResults.map(item => {
              if (!info.some(i => i.moviedb_id === item.moviedb_id)) {
                return (
                  <div className="list-create-item" key={item._id} onClick={() => addToList(item)}>
                    <img src={`${item.poster_path ? `${baseImage}${item.poster_path}` : placeholder}`} alt={item.title} className="list-create-item-img" />
                  </div>
                )
              }
              return '';
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCreateSearch;
