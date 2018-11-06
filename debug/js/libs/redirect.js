/* 
    情報取得
*/
var getDevice = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'tab';
    }else{
        return 'other';
    }
})();

/* 
    redirect
*/
var port = (location.port != "")?":"+location.port.toString():"";
var url = location.protocol + '//' + location.hostname + port + location.pathname;
var index = location.href.indexOf("/sp");
if( getDevice == 'sp' || getDevice == 'tab')
{
    //スマホ

    // PCならSPに飛ばす
    if(index < 0)
    {
        var redirectURL = url + "./sp/";
        redirectURL = redirectURL + location.search;
        if (document.referrer)
        {
            var referrer = "referrer=" + encodeURIComponent(document.referrer);
            redirectURL = redirectURL + (location.search ? '&' : '?') + referrer;
        }
        location.href = redirectURL;
    }
}
else if( getDevice == 'other' )
{
    //その他(PC含む)

    // SPならPCに飛ばす
    if(index >= 0) 
    {
        var backPara = url.slice(index);
        var redirectURL = url.replace(backPara, "");
        redirectURL = redirectURL + location.search;
        if (document.referrer)
        {
            var referrer = "referrer=" + encodeURIComponent(document.referrer);
            redirectURL = redirectURL + (location.search ? '&' : '?') + referrer;
        }
        location.href = redirectURL;
    }
}