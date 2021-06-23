import { baseImage } from '../../utils/theMovieDBBaseURL';
import infoImg from '../../images/info-icon.png';
import listTypes from '../../utils/listTypes';
import './ListItemInner.css';

const ListItemInner = ({ order, title, overview, still_path, poster_path, rank, setListItemToEdit, selectedListItem, listType, showInfo }) => {
  let editing = null
  if (selectedListItem) editing = selectedListItem.order;

  const img = still_path || poster_path;
  const infoHidden  = !showInfo.includes(order);

  const createListItem = () => {
    if (listType === listTypes.MOVIE) {
      return (
        <div className={`list-item-for-draggable list-item-movie ${order === editing ? 'list-item-edit' : ''}`} onMouseDown={setListItemToEdit}> 
          <h2 className="list-item-rank">#{rank}</h2>
          <div className="list-item-inner">
            <div className="list-item-thumbnail-container">
              <div className="list-item-thumbnail-overlay"></div>
              <div className="list-item-movie-info-img-container">
                <img src={infoImg} alt="Movie Info" className="list-item-movie-info-img" data-info="info" />
              </div>
              <div className={`list-item-movie-info ${infoHidden ? 'list-item-movie-info-hidden' : ''}`}>
                <div className="list-item-movie-info-center">
                  <h2 className="list-item-movie-info-title">{title}</h2>
                  <div className="list-item-movie-info-dash"></div>
                  <p className="list-item-movie-info-overview">{overview}</p>
                </div>
              </div>
              <img className="list-item-thumbnail" src={`${baseImage}${poster_path}`} alt={`${title}`} />
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={`list-item-for-draggable ${order === editing ? 'list-item-edit' : ''}`} onMouseDown={setListItemToEdit}> 
          <h2 className="list-item-rank">#{rank}</h2>
          <div className="list-item-inner">
            <div className="list-item-thumbnail-container">
              <div className="list-item-thumbnail-overlay"></div>
              <img className="list-item-thumbnail" src={`${baseImage}${still_path}`} alt={`Episode ${order} - ${title}`} />
            </div>
            <div className="list-item-details">
              <h4 className="list-item-number">Episode {order}</h4>
              <h2 className="list-item-title">{title}</h2>
              <p className="list-item-summary">{overview}</p>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      { img && createListItem() }
    </>
  )
};

export default ListItemInner;