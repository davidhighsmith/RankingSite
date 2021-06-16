import './Modal.css'

const Modal = ({showModal, closeModal, children}) => {
  return (
    <div data-modal className={`modal ${showModal ? '' : 'hide-modal'}`} onClick={closeModal}>
      <div className="modal-content">
        {children}
      </div>
    </div>
  )
}

export default Modal;