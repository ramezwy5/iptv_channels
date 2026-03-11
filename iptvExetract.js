import puppeteer from "puppeteer";
import fs from "node:fs";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  let link = [];
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes(".m3u8")) {
      console.log("Found m3u8:", url);
      link.push(url);
    }
  });
  await page.goto("https://ca-rt.onetv.app/manototv/index-0.m3u8?token=onetv202", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  const jsonFile = JSON.stringify(link);
  console.log("Waiting for stream...");
  // check file existing before append or create new file
  fs.access("./links.json", fs.constants.F_OK, () => {
    if (true) {
      fs.appendFileSync("./links.json", jsonFile);
    }
  });
  // fs.writeFileSync('./links.json', link)

  await browser.close();
})();
