/**
 * 
 * @param {string} type The class to be added to the popup E.g. "warning" "danger" "success"
 */
var feedbackPopup = function(message,type){
    var div = document.createElement('div');
    div.style.zIndex=999;
    div.style.position='absolute';
    div.style.right='0px';
    div.style.top='75px';
    div.className='alert alert-'+type;
    div.id='feedbackPopup';
    var span = document.createElement('span');
    span.innerHTML = message;
    div.appendChild(span);
    document.body.appendChild(div);
    setTimeout(function(){
        var $popup = $('#feedbackPopup');
        $popup.hide(500);
        setTimeout(function(){
            $popup.remove();
        },500);
    },readingTime(message).time);
}