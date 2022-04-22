import createRow from './createElement.js';
import serviceStorage from './serviceStorage.js';

const {
  getStorage,
  removeStorage,
  addContactData} = serviceStorage;

export const modalControl = (btnAdd, formOverlay) => {
  const openModal = () => {
    formOverlay.classList.add('is-visible');
  };

  const closeModal = () => {
    formOverlay.classList.remove('is-visible');
  };

  btnAdd.addEventListener('click', openModal);

  formOverlay.addEventListener('click', e => {
    const target = e.target;
    if (target === formOverlay || target.closest('.close')) {
      closeModal();
    }
  });

  return {
    closeModal,
  };
};

export const deleteControl = (btnDel, list) => {
  btnDel.addEventListener('click', () => {
    document.querySelectorAll('.delete').forEach(del => {
      del.classList.toggle('is-visible');
    });

    list.addEventListener('click', e => {
      const target = e.target;
      if (target.closest('.del-icon')) {
        removeStorage(
            target.parentNode.parentNode.querySelector('.tel').textContent);
        target.closest('.contact').remove();
      }
    });
  });
};

const addContactPage = (contact, list) => {
  list.append(createRow(contact));
};

export const formControl = (form, list, closeModal) => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newContact = Object.fromEntries(formData);
    console.log('newContact: ', newContact);
    addContactPage(newContact, list);
    addContactData(newContact);
    form.reset();
    closeModal();
  });
};

const appendSortData = (list, data) => {
  console.log('list: ', list);
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  data.forEach(element => {
    const row = createRow(element);
    list.append(row);
  });
};

export const sortFunc = (list) => {
  const thName = document.querySelector('.th-name');
  thName.addEventListener('click', () => {
    const data = getStorage('data');
    data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    localStorage.setItem('data', JSON.stringify(data));
    appendSortData(list, data);
  });

  const thSurname = document.querySelector('.th-surname');
  thSurname.addEventListener('click', () => {
    const data = getStorage('data');
    data.sort((a, b) =>
      a.surname.toLowerCase().localeCompare(b.surname.toLowerCase()));
    localStorage.setItem('data', JSON.stringify(data));
    appendSortData(list, data);
  });
};

