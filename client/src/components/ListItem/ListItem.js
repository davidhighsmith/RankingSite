import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ListItemInner from './ListItemInner';
import './ListItem.css'

const ListItem = (props) => {
  const { editMode } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? 'rgba(0, 0, 0, 0.35) 0px 1rem 2em, rgba(0, 0, 0, 0.42) 0px 1rem 2rem' : undefined,
    zIndex: isDragging ? '200' : '1',
    cursor: isDragging ? 'grab' : 'default',
  };

  return (
    <>
      { editMode ? 
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="list-item draggable" >
          <ListItemInner {...props} />
        </div>
        :
        <div className="list-item" >
          <ListItemInner {...props} />
        </div>
      }
    </>
  )
}

export default ListItem;