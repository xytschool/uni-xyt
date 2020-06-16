function getQueryParam(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return unescape(r[2]); return null;
}

function getAuthToken()
{

}

function getClientUUId(){
  var ms = new Date().getMilliseconds() / 1000
  var rand = Math.random() * 1000000 
  return ms  + rand
}

module.exports = {getQueryParam}