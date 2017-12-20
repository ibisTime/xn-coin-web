const fetch = function (code, json) {
  json["systemCode"] = 'CD-COIN000017';
  json["companyCode"] = 'CD-COIN000017';

  var sendParam = {
    code,
    json: JSON.stringify(json)
  };
  return $.ajax({
    type: 'post',
    url: '/api',
    data: sendParam
  }).pipe(function(res) {
    if(res.errorCode != "0"){
      return $.Deferred().reject(res.errorInfo);
    }
    return res.data;
  }).fail(function(error){
    if (error) {
      if (typeof error == 'object') {
        alert(error.statusText || error.responseText);
      } else {
        alert(error);
      }
    }
  });
};