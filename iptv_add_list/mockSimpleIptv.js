import puppeteer from "puppeteer";
import fs from "node:fs";

(async()=>{
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage();
    await page.goto("https://simpletv.live/upload-playlist",{waitUntil: 'networkidle2', timeout: 60000});
    //selecte parent elements from page
    const addFile = await page.$$(".Upload_tabs-nav-list__item__lMuoa")

    for(const file of addFile){
        try {
            const title = await page.evaluate(el => el.innerText,file);
            page.focus(title);
            console.log(`${title} is focused`)
        } catch (error) {
         console.error(error)   
        }
    }

    await browser.close();
})();