import fs from 'node:fs';
import puppeteer from 'puppeteer';

function showsJson(path, list){
  const fixError = (error)=>{
    if(error){
      console.error(error)
      return;
    }
  }
  const jsonFile = JSON.stringify(list);
  fs.writeFileSync(path, jsonFile, fixError)
}


(async ()=>{
  let channel_name = [];
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: false,
    userDataDir: "./tmp", 
  });
  const page = await browser.newPage();
  const it_url = 'http://dagav.com/v/arabic/arab5.php';
  const channels_list = []
  await page.goto(it_url, {waitUntil: 'networkidle2', timeout: 60000});
  const videoLinkBar = await page.$$('.ChannelTV');
  

  //loop the elements
  for(const bar of videoLinkBar){
    let videoUrl;
    let channelName;
    try {
        videoUrl = await page.evaluate((el)=>el.querySelector(".channelPage").getAttribute("src"),bar)
    } catch (error) {
        console.error(error)
    }
    try {
        channelName = await page.evaluate((el)=>el.querySelector('.stream-title').innerText,bar)
    } catch (error) {
        console.error(error)
    }
    channels_list.push(videoUrl);
    channel_name.push(channelName)
  }
  const m3uVideoList = [...channels_list];
  const m3uNameList = [...channel_name];
  console.log(m3uVideoList, m3uNameList)

  //save raw links
      fs.writeFileSync('links.text',m3uVideoList.join("\n"))
      console.log('saved raw links to links.text file')
      fs.writeFileSync('names.text',m3uNameList.join("\n"))
      console.log('saved raw links to names.text file')
//file structure
  //const fileStructure = ["#EXTM3U",...m3uVideoList.map((link, i)=>`#EXTINF:-1 tvg-id="ext" group-title="ITALY",${m3uNameList[i]} \n ${link}`)].join("\n")

//write m3u8 file
  //fs.writeFileSync('./italy_channels.m3u8', fileStructure)








  await browser.close();
})();