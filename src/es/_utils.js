/**
 * @param {string} id
 * @return {HTMLElement}
 */
export const getEl = id => document.getElementById(id);

// /**
//  * Create an object with no prototypes
//  *
//  * @param {object|undefined} properties  These properties correspond to the second argument of Object.defineProperties()
//  * @return {{}}
//  */
// export const newObject = properties => Object.create(null, properties);

// /**
//  * @param {Object} obj
//  * @param {string} property
//  * @return {boolean}
//  */
// export const objHasProp = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property);

export const isUndefined = value => typeof value === 'undefined';

// /**
//  * Sorting arrays with Non-ASCII characters
//  *
//  * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
//  *
//  * @param {object|array} list     The array to sort
//  * @returns {object|array} index
//  */
// export const sortUTF8List = list => {
//   // temp array holds objects with position and sort-value
//   const temp = list.map((el, i) => ({index: i, value: el.toLowerCase()}));
//
//   // sorting the temp array containing the reduced values
//   temp.sort((a, b) => (+(a.value > b.value) || +(a.value === b.value) - 1));
//
//   // container for the resulting order
//   return temp.map(item => list[item.index]);
// };

export const fontTag = color => `<font color="${color}">`;
export const fontClose = `</font>`;
