import fs from "node:fs";
import puppeteer from "puppeteer";

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
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-extensions",
      "--disable-features=HttpsFirstBalancedModeAutoEnable",
    ],
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  const country_url = "http://azrogo.com/iphone/arabic/mobi_arabic_5.php";
  const channels_list = [];
  let channel_name = [];
  await page.goto(country_url, { waitUntil: "networkidle2" });
  const videoLinkBar = await page.$$(".BlockCha.Eg");

  //loop the elements
  for (const bar of videoLinkBar) {
    let videoUrl;
    let channelName;
    try {
      videoUrl = await page.evaluate(
        (el) => el.querySelector(".Azrotv-ChUrl").getAttribute("href"),
        bar,
      );
    } catch (error) {
      console.error(error);
    }
    try {
      channelName = await page.evaluate(
        (el) => el.querySelector(".oui9img").alt,
        bar,
      );
    } catch (error) {
      console.error(error);
    }
    channels_list.push(`http://azrogo.com${videoUrl}`);
    channel_name.push(channelName);
  }
  let links = [];
  console.time('channels')
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes(".m3u8")) {
      console.log("Found m3u8:", url);
      links.push(url);
    }
  });
  for (let channel of channels_list) {
    await page.goto(channel, { waitUntil: "networkidle2", timeout: 0 });
  }
  console.timeEnd('channels')
  console.log(links);
  const m3uVideoList = [...links];
  const m3uNameList = [...channel_name];
  // console.log(m3uVideoList);

  //save raw links
  fs.writeFileSync("links.text", m3uVideoList.join("\n"));
  console.log("saved raw links to links.text file");
  fs.writeFileSync("names.text", m3uNameList.join("\n"));
  console.log("saved raw links to names.text file");
  //file structure
  if (m3uVideoList.length == m3uNameList.length) {
    const fileStructure = [
      "#EXTM3U",
      ...m3uVideoList.map(
        (link, i) =>
          `#EXTINF:-1 tvg-id="ext" group-title="egypt",${m3uNameList[i]} \n ${link}`,
      ),
    ].join("\n");
    //write m3u8 file
    fs.writeFileSync("./egypt_channels.m3u8", fileStructure);
  }

  await browser.close();
})();
