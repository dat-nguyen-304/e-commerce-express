const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => new Types.ObjectId(id);

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

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] === null) {
            delete obj[k];
        }
    })
    return obj;
}

const updateNestedObjectParser = obj => {
    const final = {};
    console.log({ obj });
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray()) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            })
        } else {
            final[k] = obj[k];
        }
    })
    console.log({ final });
    return final;
}

module.exports = {
    convertToObjectIdMongodb,
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}