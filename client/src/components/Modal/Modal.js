import './Modal.css'

const Modal = ({showModal, closeModal, showX, children}) => {
  return (
    <div data-modal className={`modal ${showModal ? '' : 'hide-modal'}`} onMouseDown={closeModal}>
      <div className="modal-content">
        {showX && <div data-modal className="modal-x" onMouseDown={closeModal}><span data-modal>X</span></div> }
        {children}
      </div>
    </div>
  )
}

export default Modal;