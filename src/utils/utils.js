function getQueryParam(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return unescape(r[2]); return null;
}

function setAuthToken(token)
{
   localStorage.setItem('token', token)
}

function getAuthToken()
{
   var token = localStorage.getItem('token')
   return token
}

function getComId() {
    let com_id_storge = localStorage.getItem('com_id');
    return com_id_storge 
}

function setComId(com_id_storge) {
    localStorage.setItem('com_id',com_id_storge);
    return 
}



function getClientUUId(){
  var ms = new Date().getMilliseconds() / 1000
  var rand = Math.random() * 1000000 
  return ms  + rand
}

module.exports = {getQueryParam, getAuthToken, setAuthToken,getComId,setComId}