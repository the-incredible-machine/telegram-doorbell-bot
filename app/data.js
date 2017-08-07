const jsonfile = require('jsonfile')
const _ = require('lodash');
const fs = require('fs');

(function () {
  const file = 'app/data.json';
  var dataObj = JSON.parse(fs.readFileSync(file));

  var toggleMembership = function(chatId, firstName, studioId){
    var ppl = dataObj[studioId].people;
    var studioName = dataObj[studioId].studioName;
    
    var index = _.findIndex( ppl, function(p){
      return p.chatId === chatId;
    });

    if( index > -1 ) {
      //ppl.slice(index, index+1);
      _.remove(ppl, function(p){ return p.chatId === chatId });
      updateFile();
      return('You are removed from '+ studioName);
    } else {
      ppl.push({
        name: firstName,
        chatId: chatId
      });
      updateFile();
      return('You are added to '+studioName);
    }
  }
  var getMemberCount = function(studioId){
    return(dataObj[studioId].people.length);
  }

  var getData = function() {
    return dataObj;
  }
  
  var updateFile = function(){
      fs.writeFile(file, JSON.stringify(dataObj, null, 2),function(err){
        if(err){
          console.log("write file error", err);
        }
      });
    }
  
  module.exports.toggleMembership = toggleMembership;
  module.exports.getMemberCount = getMemberCount;
  module.exports.getData = getData;
}());