const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const removeBtn = document.getElementById('btn--remove');

const closeModal = () => {
  modal.classList.remove('visible');
  modalForm.reset();
  removeBtn.classList.add('hidden');
};

const openModal = () => {
  modal.classList.add('visible');
};

export { closeModal, openModal, modalForm, removeBtn };
