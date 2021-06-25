import { useEffect, useState } from 'react';
import { withRouter, useParams, useHistory, Link } from 'react-router-dom';
import dateFormat from 'dateformat';
import { baseImage } from '../../utils/theMovieDBBaseURL';
import placeholder from '../../images/placeholder-600x900.jpg';
import LoadingIcon from '../../images/LoadingIcon';
import Nav from '../Nav/Nav';
import './ListInfo.css';
import { instance as axios } from '../../utils/axios';

const ListInfo = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [topBannerInfo, setTopBannerInfo] = useState({});
  const [listItems, setListItems] = useState({});
  const [media, setMedia] = useState([]);
  const [updatedItems, setUpdatedItems] = useState('');
  const [attemptedUpdate, setAttemptedUpdate] = useState('');
  const [listType, setListType] = useState('');
  const [description, setDescription] = useState('');
  const { id } = useParams();
  const history = useHistory();
  const { state } = location;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/api/lists/${id}`);
      if (!data.message) {
        setListItems(data.list);
        setTopBannerInfo({ title: data.title, subtitle: data.subtitle });
        setDescription(data.description);
        setListType(data.list_type);
        setMedia(data.media);
        setUpdatedItems(data.updated_items);
      }
      setLoading(false);
    }
    
    if (state) {
      setListItems(state.listItems);
      setTopBannerInfo(state.topBannerInfo);
      setDescription(state.description);
      setListType(state.listType);
      setMedia(state.media);
      setUpdatedItems(state.updatedItems);
      setLoading(false);
      return;
    }

    fetchData();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const goToListPage = () => {
    history.push({
      pathname: `/lists/${id}`, 
      state: {
        listItems,
        topBannerInfo,
        description,
        listType,
        media,
        updatedItems,
      }
    });
  }

  const getTotalItems = () => listItems.length;
  const getRankedItems = () => listItems.reduce((total, curr) => {
    return curr.rank !== null ? total += 1 : total;
  }, 0);
  const getUnrankedItems = () => listItems.reduce((total, curr) => {
    return curr.rank === null ? total += 1 : total;
  }, 0);

  const updateListItems = async () => {
    // Only doing it this way since only 1 person will be using this app
    if (attemptedUpdate !== '') {
      const time = Date.now();
      const lastAttemptedUpdate = new Date(attemptedUpdate);
      const timeDiff = Math.floor((time - lastAttemptedUpdate) / 1000);
      if (timeDiff < 10) return;
    }

    setUpdating(true);
    setAttemptedUpdate(Date.now());
    const { data } = await axios.put(`/api/lists/update/${id}`, {
      media,
      listType,
      listItems,
    });

    const { updatedList } = data;

    // items were updated
    if (data.updated) {
      setListItems(updatedList.list);
      setTopBannerInfo({ title: updatedList.title, subtitle: updatedList.subtitle });
      setDescription(updatedList.description);
      setListType(updatedList.list_type);
      setUpdatedItems(updatedList.updated_items);

      history.replace({
        pathname: location.pathname, 
        state: {
          listItems: updatedList.list,
          topBannerInfo: { title: updatedList.title, subtitle: updatedList.subtitle },
          description: updatedList.description,
          listType: updatedList.list_type,
        }
      });
    }
    // items weren't updated but updated items time needs changed
    else {
      setUpdatedItems(updatedList.updated_items);
    }
    setUpdating(false);
  }

  return (
    <>
    {loading ? <div>Loading</div> : 
      <div>
      <Nav active="lists" />

      <div className="list-info-container">

        <div className="list-info-top-banner-container">
          <div className="list-info-top-banner">
            <h1 className="list-info-top-banner-title">{topBannerInfo.title}</h1>
            <h3 className="list-info-top-banner-subtitle">{topBannerInfo.subtitle}</h3>
          </div>
          <div className="list-info-top-banner-right">
            <button className="list-info-top-banner-return" onClick={goToListPage}>Return to List</button>
          </div>
        </div>

        <div className="list-info-stats-container">
          <div className="list-info-stats">
            <h3 className="list-info-stats-count">{getTotalItems()}</h3>
            <h4 className="list-info-stats-title">Total Items</h4>
          </div>
          <div className="list-info-stats">
            <h3 className="list-info-stats-count">{getRankedItems()}</h3>
            <h4 className="list-info-stats-title">Ranked</h4>
          </div>
          <div className="list-info-stats">
            <h3 className="list-info-stats-count">{getUnrankedItems()}</h3>
            <h4 className="list-info-stats-title">Unranked</h4>
          </div>
        </div>

        <div className="list-info-update-container">
          <div className="list-info-stats-container">
            <div className="list-info-stats">
            <div className="media-page-right-time-container">
                  <h3 className="media-page-right-stats-date">{dateFormat(updatedItems, "UTC:m/d/yy")}</h3>
                  <h4 className="media-page-right-stats-time">{dateFormat(updatedItems, "h:MM:ss TT")}</h4>
                </div>
              <h4 className="list-info-stats-title">Last Updated</h4>
            </div>
          </div>

          <button className="list-info-update-button" onClick={updateListItems}>{updating ? <LoadingIcon width={70} height={70} /> : 'Update'}</button>
        </div>


        <div className="list-info-media-items-container">
          <h3 className="list-info-media-items-title">Media in this list</h3>
          <div className="list-info-media-items">
            {media.map(item => (
              <Link to={`/media/${item._id}`} className="list-info-media-item" key={item._id}>
                <img src={`${item.poster_path ? `${baseImage}${item.poster_path}` : placeholder}`} alt={item.title} className="list-info-media-items-img" />
                <div className="media-search-item-info-container">
                  <div className="media-search-item-info">
                    <h3 className="media-search-item-title">{item.title}</h3>
                    <h4 className="media-search-item-year">({dateFormat(item.release_date, "yyyy")})</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
    }
    </>
  )
};

export default withRouter(ListInfo);
