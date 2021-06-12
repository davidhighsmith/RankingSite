import ListCard from '../ListCard/ListCard';
import ListTypes from '../../utils/listTypes';
import "./MediaLists.css";

const MediaLists = ({ lists }) => {
  const noTitleTypes = [
    ListTypes.TV_SINGLE_SHOW_SINGLE_SEASON_EPISODES,
    ListTypes.TV_SINGLE_SHOW_EPISODES,
    ListTypes.TV_SINGLE_SHOW_SEASONS
  ];

  console.log(lists);

  return (
    <div className="media-page-right-lists-container">
      <div className="media-page-right-lists-title-container">
        <h3 className="media-page-right-lists-title">Lists</h3>
      </div>
      <div className="media-page-right-lists">
        {lists &&
          lists.map(list => {
            const noMainTitle = noTitleTypes.includes(list.list_type);
            return <ListCard id={list._id} subtitle={list.subtitle} updated={list.updatedAt} key={list._id} noMainTitle={noMainTitle} />
        })
        }
        {/* <ListCard id="2" subtitle="Season 1" updated="2021-05-04" noMainTitle />
        <ListCard id="2" subtitle="Season 2" updated="2021-05-04" noMainTitle /> */}
      </div>
    </div>
  )
};

export default MediaLists;
