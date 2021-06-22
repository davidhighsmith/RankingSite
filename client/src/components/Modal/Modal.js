import './Modal.css'

const Modal = ({showModal, closeModal, showX, children}) => {
  return (
    <div data-modal className={`modal ${showModal ? '' : 'hide-modal'}`} onClick={closeModal}>
      <div className="modal-content">
        {showX && <div data-modal className="modal-x" onClick={closeModal}><span data-modal>X</span></div> }
        {children}
      </div>
    </div>
  )
}

export default Modal;