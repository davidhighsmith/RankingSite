import { useEffect, useState } from 'react';
import { useParams, useHistory, withRouter } from 'react-router-dom';
import _ from 'lodash';
import ListBanner from '../ListBanner/ListBanner';
import ListContainer from '../ListContainer/ListContainer';
import EditToolbar from '../EditToolbar/EditToolbar';
import Controls from '../Controls/Controls';
import './Lists.css';
import { instance as axios } from '../../utils/axios';

const Lists = ({ location }) => {
  // TODO: Remove values after finished working on this page
  const [topBannerInfo, setTopBannerInfo] = useState({
    title: 'Brooklyn Nine-Nine',
    subtitle: 'Season 1'
  });
  const [description, setDescription] = useState('');
  const [listType, setListType] = useState('');
  const [media, setMedia] = useState([]);
  // TODO: Remove values after finished working on this page
  const [listItems, setListItems] = useState([
    {
      uuid: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 1,
      title: 'Pilot',
      overview: 'Detective Jake Peralta is a talented, but carefree police detective at Brooklyn\'s 99th precinct who, along with his eclectic group of colleagues, are used to having a lax captain around the office. However, when tightly-wound Captain Ray Holt takes over, he is determined to make this dysfunctional group of detectives into the best precinct in Brooklyn.',
      still_path: 'https://image.tmdb.org/t/p/w500/zBDTEJf7TiqaMI2VdQQSelJ67GA.jpg',
      rank: 6,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 1,
    },
    {
      uuid: '2b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 2,
      title: 'The Tagger',
      overview: 'When Jake is late for roll call, Captain Ray Holt assigns him to a graffiti case that Jake feels is below his level. However, when the culprit turns out to be the Deputy Commissioner’s son, the case becomes a major problem. Meanwhile, Gina’s psychic friend visits the precinct and gets inside Charles.',
      still_path: 'https://image.tmdb.org/t/p/w500/j7L0GDSXWmKaZ1nlxEOoA3m7z7p.jpg',
      rank: 7,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 2,
    },
    {
      uuid: '3b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 3,
      title: 'The Slump',
      overview: 'When Jake starts accumulating unsolved cases, the other detectives worry his losing streak will rub off on them; Amy, Rosa and Gina run a program for at-risk youth; Boyle helps Sergeant Jeffords with a case.',
      still_path: 'https://image.tmdb.org/t/p/w500/o2K9lcwhcvWc0kQDzgXzNXINVU9.jpg',
      rank: 5,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 3,
    },
    {
      uuid: '4b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 4,
      title: 'M.E. Time',
      overview: 'Much to the team’s annoyance, Jake hits on an attractive medical examiner, Dr. Rossi at a crime scene and holds up the autopsy report. He learns his lesson when Dr. Rossi turns out to be more than he bargained for. Meanwhile, Amy’s purse-snatching case is stalled when the sketch artist is out sick, but she discovers that Sgt. Jeffords has hidden artistic talents.',
      still_path: 'https://image.tmdb.org/t/p/w500/9dozcGhSyLHMVp8pFUA45UwVIjN.jpg',
      rank: 2,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 4,
    },
    {
      uuid: '5b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 5,
      title: 'The Vulture',
      overview: 'A detective from Major Crimes takes over Jake\'s nearly solved murder case and steals his thunder.',
      still_path: 'https://image.tmdb.org/t/p/w500/qaG1aJWVRXpSd1WDyicHLnYFGJh.jpg',
      rank: 3,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 5,
    },
    {
      uuid: '6b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 6,
      title: 'Halloween',
      overview: 'It\'s Halloween night, a busy time of the year for any police precinct. Amy detests the holiday, and is not thrilled when she has to don a costume to go undercover on street patrol with Charles. Back at the precinct, Jake bets Captain Holt that he can steal his Medal of Valor before midnight, which results in him bringing out some costumes of his own.',
      still_path: 'https://image.tmdb.org/t/p/w500/41wJeO3WBgKxzEmI8BrsLHPq2W5.jpg',
      rank: 1,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 6,
    },
    {
      uuid: '7b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 7,
      title: '48 Hours',
      overview: 'When Jake makes an arrest without a lot of proof, he only has 48 hours to collect evidence, or else the "perp" will be released. After his unsuccessful interrogation of the suspect, Jake forces his co-workers to spend their weekend helping him crack the case. So, while the team is stuck at the precinct, Charles judges a pie contest between Gina and Rosa, and Holt helps Terry look better in the eyes of his in-laws.',
      still_path: 'https://image.tmdb.org/t/p/w500/gjpwzl6DSkbZD5Co1lfbzuLYvZP.jpg',
      rank: 4,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 7,
    },
    {
      uuid: '8b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      order: 8,
      title: 'Old School',
      overview: 'Jake gets to spend the day with his hero, a former crime reporter; Terry and Charles work with Rosa on how she comes across on the witness stand.',
      still_path: 'https://image.tmdb.org/t/p/w500/uRjBnK21QqTAVs7LcLwjrGRlxnq.jpg',
      rank: null,
      media_id: 'wegergtht',
      season_number: 1,
      episode_number: 8,
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
      }
      setLoading(false);
    }

    if (state) {
      setListItems(state.listItems);
      setTopBannerInfo(state.topBannerInfo);
      setDescription(state.description);
      setListType(state.listType);
      setMedia(state.media);
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
  }

  const getRankedListItemCount = () => {
    return document.getElementsByClassName('list-item').length;
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

    // Higher Ranking
    if (prevRank > updatedListItem.rank) {
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
            <Controls setEditMode={toggleEditMode} goToInfoPage={goToInfoPage} getRemoveListItem={getRemoveListItem} removeListItemInfo={removeListItemInfo} removeListItem={removeListItem} addListItem={addListItem} newListItemWarning={newListItemWarning} setNewListItemWarning={setNewListItemWarning} editMode={editMode} />
          </div>
        </div>
        <ListContainer editMode={editMode} setListItemToEdit={setListItemToEdit} listItems={editMode ? dumbyListItems : listItems} listOrder={listOrder} updateAfterDrop={updateAfterDrop} selectedListItem={selectedListItem} />
        {editMode ? <EditToolbar {...selectedListItem} updateSelectedListItem={updateSelectedListItem} saveChanges={saveChanges} discardChanges={discardChanges} /> : null}
      </div>
      }
    </>
  );
}

export default withRouter(Lists);
