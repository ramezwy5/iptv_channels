import puppeteer from "puppeteer";
import fs from "node:fs";
function readJson(path) {
  const fixError = () => {
    if (error) {
      console.error(error);
      return;
    }
  };
  const list = fs.readFileSync(path, "utf-8");
  const arr = JSON.parse(list, "utf-8", fixError);
  return arr;
}

function showsJson(path, list) {
  const fixError = (error) => {
    if (error) {
      console.error(error);
      return;
    }
  };
  const jsonFile = JSON.stringify(list);
  fs.writeFileSync(path, jsonFile, fixError);
}

(async () => {
  let channels_list;
  let m3uVideoList;
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    timeout: 0,
    args: [
      "--disable-extensions",
      "--disable-features=HttpsFirstBalancedModeAutoEnable",
    ],
  });

  const page = await browser.newPage();
  channels_list = readJson("./egypt_channels_list.json");
  let links = new Set();
  page.on("request", (request) => {
    let url = request.url();
    if (url.includes(".m3u8") && !url.includes("/mono")) {
      console.log("Found m3u8:", url);
      url = url.replace(/(.*)(?<=id=)/gm, "");
      if(url.includes("/^Plyr/")){url.replace(/(^<=)(.*)(http)/, "")}
      links.add(url);
    }
  });
  
  for (let channel of channels_list) {
    await page.goto(channel, { waitUntil: "networkidle2", timeout: 0 });
    await page.waitForSelector("#videohtml5");
  }
  let linksList = Array.from(links);
  console.log(linksList)
  m3uVideoList = [...linksList];
  console.log(m3uVideoList)

  //save raw links
  fs.writeFileSync("links.txt", m3uVideoList.join("\n"));
  console.log("saved raw links to links.text file");

  //file structure
  const fileStructure = [
    "#EXTM3U",
    ...m3uVideoList.map(
      (link, i) => `#EXTINF:-1 tvg-id="ext" group-title="egypt",${i}\n${link}`,
    ),
  ].join("\n");
  //write m3u8 file
  fs.writeFileSync("./egypt_channels.m3u8", fileStructure);
  await browser.close();
})();
