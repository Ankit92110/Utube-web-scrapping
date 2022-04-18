const puppeteer=require('puppeteer');

// npm install pdfkit-> to install the package for pdf

const pdf=require('pdfkit');

const fs=require('fs');




const link='https://youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph';
let cTab;
(async function(){
    try{
        let browserOpen=puppeteer.launch(
            {
                headless:false,
                defaulltViewport :null,
                args : ['--start-maximized']
            }
        )
        let browserInstance=await browserOpen;
        let allTabsArr=await browserInstance.pages();
        cTab=allTabsArr[0];
        await cTab.goto(link);
        await cTab.waitForSelector('h1#title');
        let name=await cTab.evaluate(function(select){return document.querySelector(select).innerText},'h1#title')
        //console.log(name);
    let allData=await cTab.evaluate(getData,'#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer')
     console.log(name,allData.noofvideos,allData.noofviws);
        let totalVideos=allData.noofvideos.split(" ")[0];
        console.log(totalVideos);
        let currentVideos=await getCVideosLength();
        console.log(currentVideos);
        console.log("in just before call while a");
        console.log(totalVideos-currentVideos);
        console.log(totalVideos);
        console.log(currentVideos);
        let ans=totalVideos-currentVideos;
        console.log(ans);
        while(1038-currentVideos >= 20){
            //console.log("in while a")
           await scrollToBottom();
           currentVideos=await getCVideosLength()
           
        }
      //  console.log('getStateu cllled');
        let finalist=await getStats();
      //  console.log("getstue finished");
      //  console.log(finalist);
// .pipe make a pipeline for pdfcreation
// and fs.createWrite make a file which name we decleared as 'play-pdf'}

    let pdfdoc=new pdf
      pdfdoc.pipe(fs.createWriteStream('play2.pdf'))
      pdfdoc.text(JSON.stringify(finalist))
      pdfdoc.end()

    }catch(error){
      console.log(error);
    }
})()
function getData(selector){
    let allelements=document.querySelectorAll(selector);
    let noofvideos=allelements[0].innerText;
    let noofviws=allelements[1].innerText;
    return {noofvideos,noofviws};
}

async function getCVideosLength(){
    let lenth= await cTab.evaluate(getlength,'#video-title')
    return lenth;
}


async function scrollToBottom(){
    await cTab.evaluate(goToBottom)
    function goToBottom(){
       // console.log("india");
        window.scrollBy(0,window.innerHeight);
       // console.log("china");
    }
}
function getlength(durationSelector){
    let durationElem=document.querySelectorAll(durationSelector);
    return durationElem.length;
}





async function getStats(){
   // console.log("in getstatus function ");
    let list=await cTab.evaluate(getNameAndDuration,"#video-title","span#text");
   // console.log("complete getstatus function");
    return list;
}


function getNameAndDuration(videoSelector,durationSelector){
    let videElem=document.querySelectorAll(videoSelector);
    let durationElem=document.querySelectorAll(durationSelector);
    let currentlist=[]
    for(let i=0;i<durationElem.length;i++){
        let videTitle=videElem[i].innerText
        let duration=durationElem[i].innerText
        currentlist.push({videTitle,duration})
    }
    return currentlist;
}