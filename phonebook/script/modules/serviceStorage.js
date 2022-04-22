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

export default {
  getStorage,
  removeStorage,
  addContactData,
};
