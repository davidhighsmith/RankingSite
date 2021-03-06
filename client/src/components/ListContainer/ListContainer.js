import {
  DndContext, 
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
} from '@dnd-kit/sortable';
import _ from 'lodash';
import ListItem from '../ListItem/ListItem';
import listTypes from '../../utils/listTypes';

import './ListContainer.css';

const ListContainer = ({ editMode, setListItemToEdit, listItems, listOrder, listType, updateAfterDrop, selectedListItem, showInfo }) => {
  const removeUnranked = (listItems) => {
    const filtered = [];
    listItems.forEach(li => { if (li.rank !== null) filtered.push(li) });
    return filtered;
  }

  const orderRanked = (listItems) => {
    const ranked = _.cloneDeep(listItems);
    return ranked.sort((a, b) => {
      return a.rank - b.rank;
    })
  }

  const getRankedList = () => {
    const filtered = removeUnranked(listItems);
    const ranked = orderRanked(filtered);
    return ranked;
  }

  const list = getRankedList();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 15,
      }
    })
  );

  return (
    <div className={`list-container ${listType === listTypes.MOVIE ? 'list-container-movie' : ''} ${editMode ? 'list-container-edit' : ''}`}>
      { editMode ? 
        <DndContext sensors={sensors} onDragEnd={updateAfterDrop}>
          <SortableContext items={listOrder} key={Math.floor(Math.random() * 1000000) + 1}>
            {listOrder.map((item, index) => 
              <ListItem 
                {...listItems[index]} 
                key={item} 
                id={item} 
                setListItemToEdit={setListItemToEdit} 
                editMode={editMode} 
                selectedListItem={selectedListItem} 
                listType={listType}
                showInfo={showInfo}
              />)}
          </SortableContext>
        </DndContext> 
        :
        list.map(item => 
          <ListItem 
            {...item} 
            key={item.rank} 
            setListItemToEdit={setListItemToEdit} 
            editMode={editMode} 
            listType={listType}
            showInfo={showInfo}
          />)
      }
    </div>
  )
};

export default ListContainer;