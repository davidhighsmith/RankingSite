import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ListCreateItem.css';

const ListCreateItem = ({ id, info, removeFromList, drag }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? 'rgba(0, 0, 0, 0.2) 0px 0.4rem 0.8em, rgba(0, 0, 0, 0.3) 0px 0.4rem 0.8rem' : undefined,
    zIndex: isDragging ? '200' : '1',
    cursor: isDragging ? 'grab' : 'default',
  };

  return (
    <>
      { drag ? 
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="show-list-item">
          <div className="show-list-item-title">
            <h3 title={info.title}>{info.title}</h3>
          </div>
          <div className="show-list-item-remove" onClick={() => removeFromList(info)}>X</div>
        </div>
      :
        <div className="show-list-item">
          <div className="show-list-item-title">
            <h3 title={info.title}>{info.title}</h3>
          </div>
          <div className="show-list-item-remove" onClick={() => removeFromList(info)}>X</div>
        </div>
      }
    </>
  )
}

export default ListCreateItem;
