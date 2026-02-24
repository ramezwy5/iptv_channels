import fs from 'node:fs';
import puppeteer from 'puppeteer';




(async ()=>{
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp", 
  });
  const page = await browser.newPage();
  const it_url = 'https://famelack.com/it';
  const channels_list = []
  await page.goto(it_url, {waitUntil: 'networkidle2', timeout: 60000});
  const videoLinkBar = await page.$$('.sidebar-entry');
  

  //loop the elements
  for(const bar of videoLinkBar){
    let videoUrl;
    let channelName;
    try {
        videoUrl = await page.evaluate((el)=>el.querySelector('.video-link').getAttribute("data-video-url"),bar)
    } catch (error) {
        console.error(error)
    }
    try {
        channelName = await page.evaluate((el)=>el.querySelector('.channel-name-container').innerText,bar)
    } catch (error) {
        console.error(error)
    }
    channels_list.push({channelName,videoUrl});
  }
  console.table(channels_list)












  await browser.close();
})();