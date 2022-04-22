(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    'use strict';

    const { createRow } = require('./createElement');

    const {
      getStorage,
      removeStorage,
      addContactData } = require('./serviceStorage');

    const modalControl = (btnAdd, formOverlay) => {
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

    const deleteControl = (btnDel, list) => {
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

    const formControl = (form, list, closeModal) => {
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

    const sortFunc = (list) => {
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

    module.exports = {
      modalControl,
      deleteControl,
      formControl,
      sortFunc,
    };

  }, { "./createElement": 2, "./serviceStorage": 4 }], 2: [function (require, module, exports) {
    'use strict';

    const createContainer = () => {
      const container = document.createElement('div');
      container.classList.add('container');
      return container;
    };

    const createHeader = () => {
      const header = document.createElement('header');
      header.classList.add('header');

      const headerContainer = createContainer();
      header.append(headerContainer);
      header.headerContainer = headerContainer;

      return header;
    };

    const createLogo = title => {
      const h1 = document.createElement('h1');
      h1.classList.add('logo');
      h1.textContent = `Телефонный справочник. ${title}`;

      return h1;
    };

    const createMain = () => {
      const main = document.createElement('main');
      const mainContainer = createContainer();
      main.append(mainContainer);
      main.mainContainer = mainContainer;
      return main;
    };

    const createButtonsGroup = params => {
      const btnWrapper = document.createElement('div');
      btnWrapper.classList.add('btn-wrapper');

      const btns = params.map(({ className, type, text }) => {
        const button = document.createElement('button');
        button.type = type;
        button.textContent = text;
        button.className = className;
        return button;
      });
      btnWrapper.append(...btns);
      return {
        btnWrapper,
        btns,
      };
    };

    const createTable = () => {
      const table = document.createElement('table');
      table.classList.add('table', 'table-striped');

      const thead = document.createElement('thead');
      thead.insertAdjacentHTML('beforeend', `
    <tr>
        <th class="delete">Удалить</th>
        <th class="th-name">Имя</th>
        <th class="th-surname">Фамилия</th>
        <th>Телефон</th>
        <th>Редактировать</th>
    </tr>
    `);

      const tbody = document.createElement('tbody');

      table.append(thead, tbody);
      table.tbody = tbody;
      return table;
    };

    const createForm = () => {
      const overlay = document.createElement('div');
      overlay.classList.add('form-overlay');

      const form = document.createElement('form');
      form.classList.add('form');
      form.insertAdjacentHTML('beforeend', `
      <button class="close" type="button"></button>
      <h2 class="form-title">Добавить контакт</h2>
      <div class="form-group">
        <label class="form-label" for="name">Имя:</label>
        <input class="form-input" name="name" id="name" type="text" required/>
      </div>
      <div class="form-group">
        <label class="form-label" for="surname">Фамилия:</label>
        <input class="form-input" name="surname" 
        id="surname" type="text" required/>
      </div>
      <div class="form-group">
        <label class="form-label" for="phone">Телефон:</label>
        <input class="form-input" name="phone" 
        id="phone" type="number" required/>
      </div>
      `);

      const buttonGroup = createButtonsGroup([
        {
          className: 'btn btn-primary mr-3',
          type: 'submit',
          text: 'Добавить',
        },
        {
          className: 'btn btn-danger',
          type: 'reset',
          text: 'Отмена',
        },
      ]);

      form.append(...buttonGroup.btns);
      overlay.append(form);

      return {
        overlay,
        form,
      };
    };

    const createRow = ({ name: firstName, surname, phone }) => {
      const tr = document.createElement('tr');
      tr.classList.add('contact');

      const tdDel = document.createElement('td');
      const buttonDel = document.createElement('button');
      buttonDel.classList.add('del-icon');
      tdDel.append(buttonDel);
      tdDel.classList.add('delete');

      const tdName = document.createElement('td');
      tdName.textContent = firstName;

      const tdSurName = document.createElement('td');
      tdSurName.textContent = surname;

      const tdPhone = document.createElement('td');
      const phoneLink = document.createElement('a');
      phoneLink.classList.add('tel');
      phoneLink.href = `tel:${phone}`;
      phoneLink.textContent = phone;

      tr.phoneLink = phoneLink;

      tdPhone.append(phoneLink);

      const tdEdit = document.createElement('td');
      const btnEdit = document.createElement('button');
      btnEdit.innerText = 'Редактировать';
      btnEdit.classList.add('btn', 'btn-warning');

      tdEdit.append(btnEdit);

      tr.append(tdDel, tdName, tdSurName, tdPhone, tdEdit);
      return tr;
    };

    const createFooter = title => {
      const footer = document.createElement('footer');
      footer.classList.add('footer');

      const footerContainer = createContainer();

      footerContainer.append(`Все права защищены ©${title}`);
      footer.append(footerContainer);
      footer.footerContainer = footerContainer;

      return footer;
    };

    const hoverRow = (allRow, logo) => {
      const text = logo.textContent;
      allRow.forEach(contact => {
        contact.addEventListener('mouseenter', () => {
          logo.textContent = contact.phoneLink.textContent;
        });
        contact.addEventListener('mouseleave', () => {
          logo.textContent = text;
        });
      });
    };

    module.exports = {
      createHeader,
      createLogo,
      createMain,
      createButtonsGroup,
      createTable,
      createForm,
      createRow,
      createFooter,
      hoverRow,
    };

  }, {}], 3: [function (require, module, exports) {
    'use strict';

    const {
      createHeader,
      createLogo,
      createMain,
      createButtonsGroup,
      createTable,
      createForm,
      createRow,
      createFooter } = require('./createElement');


    const renderContacts = (elem, data) => {
      const allRow = data.map(createRow);
      elem.append(...allRow);
      return allRow;
    };

    const renderPhoneBook = (app, title) => {
      const header = createHeader();
      app.append(header);
      const logo = createLogo(title);
      const main = createMain();
      const buttonGroup = createButtonsGroup([
        {
          className: 'btn btn-primary mr-3 js-add',
          type: 'button',
          text: 'Добавить',
        },
        {
          className: 'btn btn-danger',
          type: 'button',
          text: 'Удалить',
        },
      ]);

      const table = createTable();
      const { overlay, form } = createForm();

      header.headerContainer.append(logo);
      main.mainContainer.append(buttonGroup.btnWrapper, table, overlay);
      app.append(header, main);

      const footer = createFooter(title);
      app.append(footer);

      return {
        list: table.tbody,
        logo,
        btnAdd: buttonGroup.btns[0],
        btnDel: buttonGroup.btns[1],
        formOverlay: overlay,
        form,
      };
    };

    module.exports = {
      renderContacts,
      renderPhoneBook,
    };

  }, { "./createElement": 2 }], 4: [function (require, module, exports) {
    'use strict';

    const getStorage = key => JSON.parse(localStorage.getItem(key)) || [];

    const setStorage = (key, obj) => {
      const data = getStorage(key);
      data.push(obj);
      localStorage.setItem(key, JSON.stringify(data));
    };

    const arrayRemove = (arr, value) => arr.filter((ele) => ele.phone !== value);

    const removeStorage = number => {
      let data = getStorage('data');
      try {
        data = arrayRemove(data, number);
        localStorage.setItem('data', JSON.stringify(data));
      } catch (error) {
        console.warn(error);
      }
    };

    const addContactData = contact => {
      setStorage('data', contact);
    };

    module.exports = {
      getStorage,
      removeStorage,
      addContactData,
    };

  }, {}], 5: [function (require, module, exports) {
    'use strict';

    const {
      modalControl,
      deleteControl,
      formControl,
      sortFunc } = require('./modules/control');

    const { hoverRow } = require('./modules/createElement');

    const { renderContacts, renderPhoneBook } = require('./modules/render');

    const { getStorage } = require('./modules/serviceStorage');

    {
      const init = (selectorApp, title) => {
        const app = document.querySelector(selectorApp);

        const {
          list,
          logo,
          btnAdd,
          formOverlay,
          form,
          btnDel } = renderPhoneBook(app, title);

        // Функционал
        const allRow = renderContacts(list, getStorage('data'));
        const { closeModal } = modalControl(btnAdd, formOverlay);
        hoverRow(allRow, logo);

        deleteControl(btnDel, list);
        formControl(form, list, closeModal);
        sortFunc(list);
      };

      window.phoneBookInit = init;
    }

  }, { "./modules/control": 1, "./modules/createElement": 2, "./modules/render": 3, "./modules/serviceStorage": 4 }]
}, {}, [5]);
