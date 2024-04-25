const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

//convert [a, b] into {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(element => [element, 1]));
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(element => [element, 0]));
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData
}