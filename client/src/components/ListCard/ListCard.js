import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';
import './ListCard.css';

const ListCard = ({ id, title, subtitle, updated, noMainTitle }) => {
  let left = null;

  if (noMainTitle) {
    left = (
      <div className="list-card-info">
        {subtitle ? <h2 className="list-card-title list-card-no-subtitle list-card-no-main-title">{subtitle}</h2> : null }
      </div>
    );
  }
  else {
    left = (
      <div className="list-card-info">
        <h2 className={`list-card-title ${!subtitle ? 'list-card-no-subtitle' : ''}`}>{title}</h2>
        {subtitle ? <h4 className="list-card-subtitle">{subtitle}</h4> : null }
      </div>
    );
  }

  return (
    <Link to={`/lists/${id}`} className="list-card">
      {left}
      <div className="list-card-time">
        <h3 className="list-card-time-header">Updated</h3>
        <h4 className="list-card-update-time">{dateFormat(updated, "UTC:m/d/yy")}</h4>
      </div>
    </Link>
  )
}

export default ListCard;
