import  puppeteer from 'puppeteer';
import fs from 'node:fs';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp", 
  });
  const page = await browser.newPage();
  let link = []
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.m3u8')) {
      console.log('Found m3u8:', url);
      link.push(url)
    }
  });
  await page.goto('http://azrogo.com/ff41521f-e070-4e11-89ef-e40885d1ad87', {
    waitUntil: 'networkidle2', timeout: 60000
  });
  const jsonFile = JSON.stringify(link);
  console.log('Waiting for stream...');
  
    fs.access('./links.json', fs.constants.F_OK,()=>{
      if(true){
        fs.appendFileSync('./links.json', jsonFile)
      }
    })
    // fs.writeFileSync('./links.json', link)


  await browser.close();
})();
