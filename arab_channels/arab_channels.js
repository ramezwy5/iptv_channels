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
  const it_url = "http://azrogo.com/iphone/arabic/mobi_arabic_5.php";
  const channels_list = [];
  let channel_name = [];
  await page.goto(it_url, { waitUntil: "networkidle2", timeout: 60000 });
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
  const m3uVideoList = [...channels_list];
  const m3uNameList = [...channel_name];
  console.log(m3uVideoList);

  //save raw links
  fs.writeFileSync("links.text", m3uVideoList.join("\n"));
  console.log("saved raw links to links.text file");
  fs.writeFileSync('names.text',m3uNameList.join("\n"))
  console.log('saved raw links to names.text file')
  //file structure
  //const fileStructure = ["#EXTM3U",...m3uVideoList.map((link, i)=>`#EXTINF:-1 tvg-id="ext" group-title="ITALY",${m3uNameList[i]} \n ${link}`)].join("\n")

  //write m3u8 file
  //fs.writeFileSync('./italy_channels.m3u8', fileStructure)

  await browser.close();
})();
