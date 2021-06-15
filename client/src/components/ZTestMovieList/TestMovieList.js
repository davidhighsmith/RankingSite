import { useEffect, useState } from 'react';
import { useParams, useHistory, withRouter } from 'react-router-dom';
import _ from 'lodash';
import ListBanner from './ListBanner';
import ListContainer from './ListContainer';
import EditToolbar from './EditToolbar';
import Controls from './Controls';
import '../Lists/Lists.css';
import { instance as axios } from '../../utils/axios';
import listTypes from '../../utils/listTypes';

const TestMovieList = ({ location }) => {
  // TODO: Remove values after finished working on this page
  const [topBannerInfo, setTopBannerInfo] = useState({
    title: 'Marvel Cinematic Universe',
    subtitle: ''
  });
  const [description, setDescription] = useState('');
  const [listType, setListType] = useState('Movie');
  const [media, setMedia] = useState([]);
  const [updatedItems, setUpdatedItems] = useState('');
  // TODO: Remove values after finished working on this page
  const [listItems, setListItems] = useState([
    {
      order: 1,
      title: 'Iron Man',
      overview: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.',
      still_path: null,
      poster_path: '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      rank: 1,
      media_id: 'wegergtht',
      season_number: null,
      episode_number: null,
    },
    {
      order: 2,
      title: 'The Incredible Hulk',
      overview: 'Scientist Bruce Banner scours the planet for an antidote to the unbridled force of rage within him: the Hulk. But when the military masterminds who dream of exploiting his powers force him back to civilization, he finds himself coming face to face with a new, deadly foe.',
      still_path: null,
      poster_path: '/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg',
      rank: 2,
      media_id: 'wegergtht',
      season_number: null,
      episode_number: null,
    },
    {
      order: 3,
      title: 'Iron Man 2',
      overview: 'With the world now aware of his dual life as the armored superhero Iron Man, billionaire inventor Tony Stark faces pressure from the government, the press and the public to share his technology with the military. Unwilling to let go of his invention, Stark, with Pepper Potts and James \'Rhodey\' Rhodes at his side, must forge new alliances – and confront powerful enemies.',
      still_path: null,
      poster_path: '/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg',
      rank: 3,
      media_id: 'wegergtht',
      season_number: null,
      episode_number: null,
    },
    {
      order: 4,
      title: 'Thor',
      overview: 'Against his father Odin\'s will, The Mighty Thor - a powerful but arrogant warrior god - recklessly reignites an ancient war. Thor is cast down to Earth and forced to live among humans as punishment. Once here, Thor learns what it takes to be a true hero when the most dangerous villain of his world sends the darkest forces of Asgard to invade Earth.',
      still_path: null,
      poster_path: '/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
      rank: 4,
      media_id: 'wegergtht',
      season_number: null,
      episode_number: null,
    },
    {
      order: 5,
      title: 'Captain America: The First Avenger',
      overview: 'During World War II, Steve Rogers is a sickly man from Brooklyn who\'s transformed into super-soldier Captain America to aid in the war effort. Rogers must stop the Red Skull – Adolf Hitler\'s ruthless head of weaponry, and the leader of an organization that intends to use a mysterious device of untold powers for world domination. ruthless head of weaponry, and the leader of an organization that intends to use a mysterious device of untold powers for world domination. ruthless head of weaponry, and the leader of an organization that intends to use a mysterious device of untold powers for world domination.',
      still_path: null,
      poster_path: '/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
      rank: 5,
      media_id: 'wegergtht',
      season_number: null,
      episode_number: null,
    },
    {
      order: 6,
      title: 'The Avengers',
      overview: 'When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!',
      still_path: null,
      poster_path: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
      rank: 6,
      media_id: 'wegergtht',
      season_number: null,
      episode_number: null,
    },
    {
      order: 7,
      title: 'The Avengers',
      overview: 'When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!',
      still_path: null,
      poster_path: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
      rank: 7,
      media_id: 'wegergtht',
      season_number: null,
      episode_number: null,
    },
  ]);
  const [dumbyListItems, setDumbyListItems] = useState([]);
  const [dumbyUnrankedItems, setDumbyUnrankedItems] = useState([]);
  const [listOrder, setListOrder] = useState([]);
  const [selectedListItem, setSelectedListItem] = useState({
    order: null,
    rank: null,
    title: '',
    season_number: null,
    episode_number: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [removeListItemInfo, setRemoveListItemInfo] = useState({
    activated: false,
    list_item_info: {
      order: null,
      rank: null,
      title: '',
      season_number: null,
      episode_number: null,
    }
  });
  const [removing, setRemoving] = useState(false);
  const [newListItemWarning, setNewListItemWarning] = useState(false);
  const [keyDown, setKeyDown] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const history = useHistory();
  const { state } = location;

  // immediately call another function to not have a big
  // function above the useEffects
  const handleKeyDownPress = async (e) => {
    if (keyDown) return;
    await handleKeyPresses(e);
  }

  const handleKeyUpPress = (e) => setKeyDown(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownPress);
    window.addEventListener('keyup', handleKeyUpPress);

    return () => {
      window.removeEventListener('keydown', handleKeyDownPress);
      window.removeEventListener('keyup', handleKeyUpPress);
    }
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [editMode, keyDown, selectedListItem, listOrder, removeListItemInfo, listItems, dumbyListItems, dumbyUnrankedItems, removing, newListItemWarning]);

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
  [id]);

  const goToInfoPage = () => {
    history.push({
      pathname: `/lists/${id}/info`, 
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

  const removeEditClass = () => {
    const elWithClass = document.getElementsByClassName('list-item-edit');
    [...elWithClass].forEach(el => el.classList.remove('list-item-edit'));
  }

  const getSeasonNumber = (listItem) => {
    return listItem.season_number !== null ? listItem.season_number : null;
  }

  const getEpisodeNumber = (listItem) => {
    return listItem.episode_number !== null ? listItem.episode_number : null;
  }

  const setListItemToEdit = (e) => {
    if (!editMode) return;

    // Get rank to search dumbyListItems
    const temp_rank = parseInt(e.currentTarget.getElementsByClassName('list-item-rank')[0].innerText.split('#')[1]);

    let item;

    for (const i of dumbyListItems) {
      if (i.rank === temp_rank) {
        item = i;
        break;
      }
    }

    setSelectedListItem({
      order: item.order,
      rank: item.rank,
      title: item.title,
      season_number: getSeasonNumber(item),
      episode_number: getEpisodeNumber(item),
    })
  }

  const getNewOrder = (list) => {
    let newOrder = [];
    list.forEach(item => newOrder.push(item.order.toString()));
    return newOrder;
  }

  const getDumbyInfo = () => {
    const temp = _.cloneDeep(listItems);
    let dumbyList = [];
    let dumbyUnranked = [];
    let order = [];

    temp.forEach(item => {
      if (item.rank !== null) dumbyList.push(item);
      else dumbyUnranked.push(item);
    });

    dumbyList.sort((a, b) => a.rank > b.rank ? 1 : -1);
    dumbyUnranked.sort((a, b) => a.order > b.order ? 1 : -1);

    order = getNewOrder(dumbyList);

    return [dumbyList, dumbyUnranked, order];
  }

  const toggleEditMode = () => {
    if (!editMode) {
      const [ dumbyList, dumbyUnranked, order ] = getDumbyInfo();
      setDumbyListItems(dumbyList);
      setDumbyUnrankedItems(dumbyUnranked);
      setListOrder(order);
      setRemoveListItemInfo({
        activated: false,
        list_item_info: {
          order: null,
          title: '',
          rank: null
        }
      });
      setEditMode(true);
      return;
    }

    removeEditClass();
    setSelectedListItem({
      order: null,
      rank: null,
      title: ''
    })
    setEditMode(false);
  }

  const getRemoveListItem = () => {
    // Nothing happens if there is nothing to remove
    if (dumbyListItems.length === 0) return;

    let lastIndex = null;

    dumbyListItems.forEach((item, index) => {
      if (lastIndex === null) {
        lastIndex = index;
        return;
      }

      if (item.order > dumbyListItems[lastIndex].order) lastIndex = index;
    });

    const info = {
      order: dumbyListItems[lastIndex].order,
      title: dumbyListItems[lastIndex].title,
      rank: dumbyListItems[lastIndex].rank,
      season_number: getSeasonNumber(dumbyListItems[lastIndex]),
      episode_number: getEpisodeNumber(dumbyListItems[lastIndex]),
    };

    setSelectedListItem(info);
    setRemoveListItemInfo({
      activated: true,
      list_item_info: info
    });
    handleScroll();
  }

  const setBaseRemoveListItemInfo = () => {
    setRemoveListItemInfo({
      activated: false,
      list_item_info: {
        order: null,
        rank: null,
        title: '',
        season_number: null,
        episode_number: null,
      }
    });
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const addListItem = async () => {
    if (dumbyUnrankedItems.length !== 0) {
      let list = _.cloneDeep(dumbyListItems);
      let nextIndex = null;

      // Find item in unranked item with lowest order
      dumbyUnrankedItems.forEach((item, index) => {
        if (nextIndex === null) {
          nextIndex = index;
          return;
        }
        if (item.order < dumbyUnrankedItems[nextIndex].order) nextIndex = index;
      })

      // create a temp item and set the rank to last, push to end of list
      let tempItem = dumbyUnrankedItems[nextIndex];
      tempItem.rank = getRankedListItemCount() + 1;
      list.push(tempItem);

      // remove the item that was added from unranked list
      let tempUnranked = _.cloneDeep(dumbyUnrankedItems);
      tempUnranked.splice(nextIndex, 1);

      // Get the new list order for draggable
      const getOrder = getNewOrder(list);

      setDumbyListItems(list);
      setDumbyUnrankedItems(tempUnranked);
      setListOrder(getOrder);
      setSelectedListItem({
        order: tempItem.order,
        rank: tempItem.rank,
        title: tempItem.title,
        season_number: getSeasonNumber(tempItem),
        episode_number: getEpisodeNumber(tempItem),
      });

      // Add edit class to new list item
      // sleep to let the state set
      await sleep(50);
      handleScroll('add');
      removeEditClass();
      document.getElementsByClassName('list-item')[getRankedListItemCount() - 1].classList.add('list-item-edit');
      return;
    }

    // If there is no new episode, let user know
    setNewListItemWarning(true);
  }

  const removeListItem = (remove, order = 0, rank = 0) => {
    if (removing) return;
    // Answer 'No' to remove
    if (!remove) {
      setBaseRemoveListItemInfo();
      return;
    }

    setRemoving(true);

    let list = _.cloneDeep(dumbyListItems);
    let removeIndex;

    list.forEach((item, index) => {
      if (item.order === order) {
        removeIndex = index;
        return;
      }

      if (item.rank > rank) {
        item.rank = item.rank - 1;
        return;
      }
    });

    // put removed item into var and remove it from the list at same time
    // set unranked item's rank to null then push to unranked item array
    let tempUnranked = _.cloneDeep(dumbyUnrankedItems);
    const unrankedItem = list.splice(removeIndex, 1)[0];
    unrankedItem.rank = null;
    tempUnranked.push(unrankedItem);

    // get new list order for draggables
    const getOrder = getNewOrder(list);

    // base new selected item object
    // will stay empty if the only item in the list is removed
    const newListItem = {
      order: null,
      rank: null,
      title: '',
      season_number: null,
      episode_number: null,
    }

    // Check if item to delete is ranked last

    const listCount = getRankedListItemCount();

    // if item getting removed is ranked last, move to new last place
    if (rank === listCount && listCount > 1) {
      newListItem.order = dumbyListItems[rank - 2].order;
      newListItem.rank = dumbyListItems[rank - 2].rank;
      newListItem.title = dumbyListItems[rank - 2].title;
      newListItem.season_number = getSeasonNumber(dumbyListItems[rank - 2]);
      newListItem.episode_number = getEpisodeNumber(dumbyListItems[rank - 2]);
    }

    // if item getting removed is not ranked last
    // move selected item to item ranked one lower
    // so it stays in the same place
    if (rank !== listCount && listCount > 1) {
      newListItem.order = dumbyListItems[rank].order;
      newListItem.rank = dumbyListItems[rank].rank - 1;
      newListItem.title = dumbyListItems[rank].title;
      newListItem.season_number = getSeasonNumber(dumbyListItems[rank]);
      newListItem.episode_number = getEpisodeNumber(dumbyListItems[rank]);
    }

    setSelectedListItem(newListItem);

    setDumbyListItems(list);
    setDumbyUnrankedItems(tempUnranked);
    setListOrder(getOrder);
    setBaseRemoveListItemInfo();
    setRemoving(false);
    handleScroll();
  }

  const getRankedListItemCount = () => {
    return document.getElementsByClassName('list-item').length;
  }

  const handleScroll = (newRank = 'center') => {
    // newRank === 'higher', 'lower', 'add', 'center'

    if (newRank === 'add') {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
      return;
    }

    const listItem = document.querySelector('.list-item-edit');
    if (newRank === 'center') {
      listItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return;
    }

    const bannerHeight = document.querySelector('.outer-show-container').offsetHeight;
    const listItemHeight = listItem.offsetHeight;
    const { top: elemTop, bottom: elemBottom } = document.querySelector('.list-item-edit').getBoundingClientRect();
    const scrollOffset = window.pageYOffset;
    const windowHeight = window.innerHeight;

    if (newRank === 'higher') {
        window.scrollTo({
          top: elemTop + scrollOffset - bannerHeight - listItemHeight - 30,
          behavior: 'smooth',
        });
        return;
    }

    if (newRank === 'lower') {
        window.scrollBy({
          top: elemBottom - windowHeight + listItemHeight + 30, 
          behavior: 'smooth'
        });
        return;
    }
  }

  const updateDumbyListItems = (updatedListItem, prevRank) => {
    if (prevRank === updatedListItem.rank) return;

    const newList = _.cloneDeep(dumbyListItems);
    
    // Edge case for if input was blank before adding rank in
    if (prevRank === null) {
      newList.forEach(item => {
        if (item.order === updatedListItem.order)
          prevRank = item.rank;
      })
    }

    let newRank;
    // Higher Ranking
    if (prevRank > updatedListItem.rank) {
      newRank = 'higher';
      newList.forEach(li => {
        if (li.rank === null) return;
        if (li.rank < updatedListItem.rank) return;
        if (li.rank > prevRank) return;

        if (li.order === updatedListItem.order) {
          li.rank = updatedListItem.rank;
          return;
        }
        
        li.rank = li.rank + 1;
      })
    }

    // Lower Ranking
    if (prevRank < updatedListItem.rank) {
      newRank = 'lower';
      newList.forEach(li => {
        if (li.rank === null) return;
        if (li.rank > updatedListItem.rank) return;
        if (li.rank < prevRank) return;

        if (li.order === updatedListItem.order) {
          li.rank = updatedListItem.rank;
          return;
        }
        
        li.rank = li.rank - 1;    
      })
    }

    newList.sort((a, b) => a.rank > b.rank ? 1 : -1);
    const getOrder = getNewOrder(newList);

    setListOrder(getOrder);
    setDumbyListItems(newList);
    handleScroll(newRank);
  }

  const updateSelectedListItem = (e) => {
    if (selectedListItem.order === null) return;
    if (removeListItemInfo.activated) return;

    let updatedEpisode = _.cloneDeep(selectedListItem);
    let prevRank = selectedListItem.rank;

    if (e.type === 'change') {
      // Handles backspacing until empty field or trying to put a 0 in the field
      if (e.target.value === '' || parseInt(e.target.value) === 0) {
        updatedEpisode.rank = null;
        setSelectedListItem(updatedEpisode);
        return;
      }

      // regex for numbers
      const re = /^[0-9\b]+$/;

      if (re.test(e.target.value)) {
        if (e.target.value > getRankedListItemCount())
          updatedEpisode.rank = getRankedListItemCount();
        else updatedEpisode.rank = parseInt(e.target.value);
        
        setSelectedListItem(updatedEpisode);
        updateDumbyListItems(updatedEpisode, prevRank);
      }
      
      return;
    }

    // After updating rank to null in the input field
    // Set updated rank to 1 if clicking the increase or decrease buttons
    if ((e.target.className === 'set-episode-rank-increase' 
        || e.target.className === 'set-episode-rank-decrease') && selectedListItem.rank === null) {
      updatedEpisode.rank = 1;
      setSelectedListItem(updatedEpisode);
      return;
    }

    if (e.target.className === 'set-episode-rank-increase' 
        && updatedEpisode.rank > 1) {
      updatedEpisode.rank -= 1;
      setSelectedListItem(updatedEpisode);
      updateDumbyListItems(updatedEpisode, prevRank);
    }
    if (e.target.className === 'set-episode-rank-decrease' 
        && updatedEpisode.rank < getRankedListItemCount()) {
      updatedEpisode.rank = parseInt(updatedEpisode.rank) + 1;
      setSelectedListItem(updatedEpisode);
      updateDumbyListItems(updatedEpisode, prevRank);
    }
  }

  const handleKeyPresses = async (e) => {
    if ((!editMode && e.key !== 'e') || keyDown) return;
    setKeyDown(true);
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'e', 'a', '+', 'Enter', 'r', '-', 'y', 'n', 'd', 's'];
    if (keys.includes(e.key)) {
      e.preventDefault();

      let updatedEpisode = _.cloneDeep(selectedListItem);
      let prevRank = selectedListItem.rank;
  
      // Gain rank ex. 3 -> 2
      if (e.key === 'ArrowUp') {
        if (updatedEpisode.rank === 1) return;
        if (removeListItemInfo.activated) return;
        updatedEpisode.rank -= 1;
        setSelectedListItem(updatedEpisode);
        updateDumbyListItems(updatedEpisode, prevRank);
      }
  
      // Lose rank ex 2 -> 3
      if (e.key === 'ArrowDown') {
        if (updatedEpisode.rank === getRankedListItemCount()) return;
        if (removeListItemInfo.activated) return;
        updatedEpisode.rank = parseInt(updatedEpisode.rank) + 1;
        setSelectedListItem(updatedEpisode);
        updateDumbyListItems(updatedEpisode, prevRank);
      }
      
      // move edit item to item ranked one higher
      if (e.key === 'ArrowLeft') {
        // return if at rank 1 item
        if (selectedListItem.rank === 1) return;
  
        // create new selected list item with item a rank higher
        const { order, rank, title, season_number, episode_number } = dumbyListItems[selectedListItem.rank - 2];
        const newSelectedListItem = {
          order,
          rank,
          title,
          season_number,
          episode_number,
        };
  
        setSelectedListItem(newSelectedListItem);
        handleScroll();
      }
  
      // move edit item to item ranked one lower
      if (e.key === 'ArrowRight') {
        // return if at last ranked item
        if (selectedListItem.rank === getRankedListItemCount()) return;
  
        // create new selected list item with item a rank lower
        const { order, rank, title, season_number, episode_number } = dumbyListItems[selectedListItem.rank];
        const newSelectedListItem = {
          order,
          rank,
          title,
          season_number,
          episode_number,
        };
  
        setSelectedListItem(newSelectedListItem);
        handleScroll();
      }
  
      // toggle edit mode
      if (e.key === 'e') {
        toggleEditMode();
      }
  
      // add a list item
      if (e.key === 'a' || e.key === '+') {
        if (removeListItemInfo.activated) return;
        addListItem();
      }
  
      // remove no new list items message
      if (e.key === 'Enter' && newListItemWarning) {
        setNewListItemWarning(false);
      }
  
      // remove a list item
      if (e.key === 'r' || e.key === '-') {
        getRemoveListItem();
      }
  
      // confirm removal of list item
      if (e.key === 'y' && removeListItemInfo.activated) {
        const { order, rank } = removeListItemInfo.list_item_info;
        removeListItem(true, order, rank);
      }
  
      // do not remove list item
      if (e.key === 'n' && removeListItemInfo.activated) {
        removeListItem(false);
      }
  
      // discard changes
      if (e.key === 'd') {
        discardChanges();
      }
  
      // save changes
      if (e.key === 's') {
        await saveChanges();
      }
    }
  }
  
  const updateAfterDrop = (e) => {
    if (removeListItemInfo.activated) return;
    const { active, over } = e;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = dumbyListItems.findIndex(
        item => item.order === parseInt(active.id, 10)
      );
      const newIndex = dumbyListItems.findIndex(
        item => item.order === parseInt(over.id, 10)
      );

      const newList = [];

      // dragged item rank decreasing
      if (oldIndex < newIndex) {
        dumbyListItems.forEach((item, index) => {
          if (index > newIndex) newList.push({ ...item });
          if (index < oldIndex) newList.push({ ...item });
          if (index === oldIndex) newList.push({ ...item, rank: newIndex + 1 });
          if (index <= newIndex && index > oldIndex)
            newList.push({ ...item, rank: index });
        });
      }
      // dragged item rank increasing
      if (oldIndex > newIndex) {
        dumbyListItems.forEach((item, index) => {
          if (index < newIndex) newList.push({ ...item });
          if (index > oldIndex) newList.push({ ...item });
          if (index === oldIndex) newList.push({ ...item, rank: newIndex + 1 });
          if (index >= newIndex && index < oldIndex)
            newList.push({ ...item, rank: index + 2 });
        });
      }

      newList.sort((a, b) => (a.rank > b.rank ? 1 : -1));
      const orderNumbers = getNewOrder(newList);

      setSelectedListItem({
        ...selectedListItem,
        rank: newIndex + 1
      })
      setDumbyListItems(newList);
      setListOrder(orderNumbers);
      handleScroll();
    }
  }

  const saveChanges = async () => {
    let tempList, newList = [];
    if (dumbyUnrankedItems.length !== 0)
      tempList = _.cloneDeep(dumbyListItems).concat(_.cloneDeep(dumbyUnrankedItems));
    else tempList = _.cloneDeep(dumbyListItems);

    listItems.forEach((item, index) => {
      newList.push(tempList.find(item => item.order === listItems[index].order));
    });

    let error = false;
    // Only update listItems if dumbyListItems is different
    if (!_.isEqual(listItems, newList)) {
      const { data } = await axios.put(`/api/lists/${id}`, newList);
      // TODO: maybe show some error message if there
      //       actually is an error saving
      if (!data.save) error = true;
      if (!error) setListItems(newList);
    }
    if (!error) toggleEditMode();

    // replace old listItems location state
    // so a refresh won't load old data
    history.replace({
      pathname: location.pathname, 
      state: {
        listItems: newList,
        topBannerInfo,
        description,
        listType,
        media,
      }
    });
  }

  const discardChanges = () => {
    toggleEditMode();
  }

  return (
    <>
      { loading ? null :
      <div className="full-container">
        <div className="outer-show-container">
          <div className="banner-container">
            <ListBanner {...topBannerInfo} />
            <Controls 
              setEditMode={toggleEditMode} 
              goToInfoPage={goToInfoPage} 
              getRemoveListItem={getRemoveListItem} 
              removeListItemInfo={removeListItemInfo} 
              removeListItem={removeListItem} 
              addListItem={addListItem} 
              newListItemWarning={newListItemWarning} 
              setNewListItemWarning={setNewListItemWarning} 
              editMode={editMode} 
            />
          </div>
        </div>
        <ListContainer 
          editMode={editMode} 
          setListItemToEdit={setListItemToEdit} 
          listItems={editMode ? dumbyListItems : listItems} 
          listOrder={listOrder} 
          listType={listType}
          updateAfterDrop={updateAfterDrop} 
          selectedListItem={selectedListItem} 
        />
        {editMode ? 
          <EditToolbar 
            {...selectedListItem} 
            updateSelectedListItem={updateSelectedListItem} 
            saveChanges={saveChanges} 
            discardChanges={discardChanges} 
          /> : null}
      </div>
      }
    </>
  );
}

export default withRouter(TestMovieList);
