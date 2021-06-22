import {
  DndContext, 
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import ListCreateItem from '../ListCreateItem/ListCreateItem';
import './ListCreateItemsContainer.css';

const ListCreateItemsContainer = ({info, removeFromList, listOrder, updateAfterDrop}) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 15,
      }
    })
  );

  return (
    <div className="show-list-items">
      {info.length > 1 ?
        <DndContext sensors={sensors} onDragEnd={updateAfterDrop}>
          <SortableContext 
            items={listOrder} 
            strategy={verticalListSortingStrategy}
            key={Math.floor(Math.random() * 1000000) + 1}
          >
            { listOrder.map((item, index) => 
              <ListCreateItem id={item} key={item} info={info[index]} removeFromList={removeFromList} drag={true} />
            )}
          </SortableContext>
        </DndContext> 
      :
        <>
          { info.map(item => 
            <ListCreateItem key={item.moviedb_id} info={item} removeFromList={removeFromList} drag={false} />  
          )}
        </>
      }
    </div>
  )
}

export default ListCreateItemsContainer;
