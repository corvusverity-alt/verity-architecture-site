/* ws-shared.js — auto-scroll highlighted cells into view inside .sc-wrap
   Loaded as the last script in every tutorial so it can wrap any hl helpers */
(function(){
  function scrollIntoWrap(el){
    var wrap=el.closest?el.closest('.sc-wrap'):null;
    if(!wrap)return;
    var er=el.getBoundingClientRect(),wr=wrap.getBoundingClientRect();
    var relTop=er.top-wr.top;
    var relBot=relTop+er.height;
    if(relTop<8||relBot>wrap.clientHeight-8){
      wrap.scrollTop=Math.max(0,Math.round(wrap.scrollTop+relTop-(wrap.clientHeight/2)+(er.height/2)));
    }
  }
  // Wrap the global hl() function if it exists
  var _hl=window.hl;
  window.hl=function(id){if(typeof _hl==='function')_hl(id);var el=document.getElementById(id);if(el)scrollIntoWrap(el);};
  // MutationObserver catches hlFM, hlINJ, hlOff, and any other variant
  // that adds/removes the .hl class directly
  function startObs(){
    if(!document.body)return;
    var obs=new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var m=muts[i];
        if(m.attributeName==='class'&&m.target.classList&&m.target.classList.contains('hl')){
          scrollIntoWrap(m.target);
        }
      }
    });
    obs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading'){window.addEventListener('DOMContentLoaded',startObs);}
  else{startObs();}
})();
