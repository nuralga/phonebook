import {modalControl,
  deleteControl,
  formControl,
  sortFunc} from './modules/control.js';
import createElement from './modules/createElement.js';
import * as render from './modules/render.js';
import storage from './modules/serviceStorage.js';

{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);

    const {
      list,
      logo,
      btnAdd,
      formOverlay,
      form,
      btnDel} = render.renderPhoneBook(app, title);

    // Функционал
    const allRow = render.renderContacts(list, storage.getStorage('data'));
    const {closeModal} = modalControl(btnAdd, formOverlay);
    createElement.hoverRow(allRow, logo);

    deleteControl(btnDel, list);
    formControl(form, list, closeModal);
    sortFunc(list);
  };

  window.phoneBookInit = init;
}
