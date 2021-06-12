import React from 'react'
import './ListBanner.css'

// TODO:
// Update this to have the subtitle be optional
// Keep banner size the same with or without subtitle

const ListBanner = ({ title, subtitle }) => {
  return (
      <div className="list-banner-container">
        <h1 className={`list-banner-title ${subtitle === '' ? 'list-banner-title-full' : ''}`}>{title}</h1>
        {subtitle === '' ? null : <h3 className="subtitle-title">{subtitle}</h3>}
      </div>
  )
}

export default ListBanner;