$(function(){
  $arts=$('#post>article');
  var left=0,right=0;
  for(var i=0;i<$arts.length;i++){
    if(left<=right){
      $arts[i].className='left';
      left+=$arts[i].offsetHeight;
    }
    else{
      $arts[i].className='right';
      right+=$arts[i].offsetHeight;
    }
  }
});
