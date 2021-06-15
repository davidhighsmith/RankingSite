import React from 'react'
import '../Controls/Controls.css'
import AddListItems from './AddListItems';

const Controls = ({ setEditMode, goToInfoPage, getRemoveListItem, removeListItemInfo, removeListItem, addListItem, newListItemWarning, setNewListItemWarning, editMode }) => {
  return (
    <div className="controls-container">
      {editMode ? 
        <AddListItems getRemoveListItem={getRemoveListItem} removeListItemInfo={removeListItemInfo} removeListItem={removeListItem} addListItem={addListItem} newListItemWarning={newListItemWarning} setNewListItemWarning={setNewListItemWarning} />
      : null }
      <div className="controls-buttons">
        <button className="controls-buttons-list-info" onClick={goToInfoPage}>List Info</button>
        <button className="controls-buttons-settings">Settings</button>
        <button className="controls-buttons-edit" onClick={setEditMode}>Edit Mode</button>
      </div>
    </div>
  )
}

export default Controls;