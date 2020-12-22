const Labels = require('../models/label');

exports.allLabels = function () {
  var tmp = [];
  Labels.find().then(labels => {
    labels.forEach(label =>{
        tmp.push({_id:label._id.toString(), name: label.name});
    });
  });
  return tmp;
};