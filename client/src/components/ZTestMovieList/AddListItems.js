import React from 'react'
import '../AddListItems/AddListItems.css'

const AddListItems = ({ getRemoveListItem, removeListItemInfo, removeListItem, addListItem, newListItemWarning, setNewListItemWarning }) => {
  const { order, title, rank, episode_number } = removeListItemInfo.list_item_info;
  return (
    <div className="add-list-items">
      <h3>Add/Remove<br/>List Items</h3>
      <div className="button-container">
        <button className="add-button" onClick={addListItem} />
        <button className="remove-button" onClick={getRemoveListItem} />
      </div>
      { removeListItemInfo.activated ? 
        <div className="add-list-items-confirmation-container">
          <div className="add-list-items-confirmation">
            <p className="add-list-items-confirmation-top">Confirm removal</p>
            <div className="add-list-items-confirmation-info">
              <p className="add-list-items-confirmation-info-episode-number">Episode {episode_number}</p>
              <p className="add-list-items-confirmation-info-episode-title">{title}</p>
            </div>
            <div className="add-list-items-confirmation-buttons">
              <button className="add-list-items-yes" onClick={() => removeListItem(true, order, rank)}>YES</button>
              <button className="add-list-items-no" onClick={() => removeListItem(false)}>NO</button>
            </div>
          </div>
        </div> : null
      }
      { newListItemWarning ?
        <div className="add-list-items-confirmation-container">
          <div className="add-list-items-warning-container">
            <p className="add-list-items-warning">There are no more new list items for this list.<br />Refresh in settings to check for more.</p>
            <button className="add-list-items-warning-button" onClick={() => setNewListItemWarning(false)}>OK</button>
          </div>
        </div> : null
      }
    </div>
  )
}

export default AddListItems;