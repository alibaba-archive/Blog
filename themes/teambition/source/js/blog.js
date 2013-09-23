//date flow
arts=$('#post>article');
var left=0,right=0;
for(var i=0;i<arts.length;i++){
  if(left<=right){
    arts[i].className='left';
    left+=arts[i].offsetHeight;
  }
  else{
    arts[i].className='right';
    right+=arts[i].offsetHeight;
  }
}
title=$('.brand');
function navHeight(top,h){
  var rate=1.*top/h;
  var height=(100-h*rate)+'px';
  var bg=(-15-h*2/5*rate)+'px';
  bg='15px '+bg;
  title.css({
    'height':height,
    'line-height':height,
    'background-position':bg
  });
}
function navControl(){
  var h=45;
  var top=$(window).scrollTop();
  if(top>h)return navHeight(h,h);
  if(top<0)return navHeight(0,h);
  navHeight(top,h);
}
navHeight(0,45);
$(window).scroll(navControl);
