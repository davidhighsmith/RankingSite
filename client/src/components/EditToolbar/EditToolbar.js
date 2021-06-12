import React from 'react'
import './EditToolbar.css'

const EditToolbar = ({ order, rank, title, episode_number, updateSelectedListItem, saveChanges, discardChanges }) => {
  const episode = () => {
    if (isNaN(order) || order === null) return (<p className="set-episode-rank-no-episode">No episode selected</p>)
    return (
      <>
        <p className="set-episode-rank-episode-number">Episode {episode_number}</p>
        <p className="set-episode-rank-episode-title" title={title}>{title}</p>
      </>
    )
  }

  return (
    <div className="edit-container">
      <div className="set-episode-rank">
        <div className="set-episode-rank-episode">
          {episode()}
        </div>
        <div className="set-episode-rank-controls">
          <button className="set-episode-rank-increase" onClick={updateSelectedListItem} />
          <input className="set-episode-rank-input" type="text" value={rank || ''} onChange={updateSelectedListItem} />
          <button className="set-episode-rank-decrease" onClick={updateSelectedListItem} />
        </div>
      </div>
      <div className="save-ranks">
        <button className="save-ranks-discard" onClick={discardChanges}>Discard</button>
        <button className="save-ranks-save" onClick={saveChanges}>Save</button>
      </div>
    </div>
  )
}

export default EditToolbar;