import { baseImage } from '../../utils/theMovieDBBaseURL';

const ListItemInner = ({ order, title, overview, still_path, rank, setListItemToEdit, selectedListItem }) => {
  let episode = null
  if (selectedListItem) episode = selectedListItem.order;

  return (
    <>
      { still_path &&
        <div className={`list-item-for-draggable ${order === episode ? 'list-item-edit' : ''}`} onMouseDown={setListItemToEdit}> 
          <h2 className="list-item-rank">#{rank}</h2>
          <div className="list-item-inner">
            <div className="list-item-thumbnail-container">
              <div className="list-item-thumbnail-overlay"></div>
              <img className="list-item-thumbnail" src={`${baseImage}${still_path}`} alt={`Episode ${order}`} />
            </div>
            <div className="list-item-details">
              <h4 className="list-item-number">Episode {order}</h4>
              <h2 className="list-item-title">{title}</h2>
              <p className="list-item-summary">{overview}</p>
            </div>
          </div>
        </div>
      }
    </>
  )
};

export default ListItemInner;
