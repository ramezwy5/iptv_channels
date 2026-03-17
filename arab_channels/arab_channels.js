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
    timeout: 0,
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
    channels_list.push(`http://azrogo.com/${videoUrl}`);
    channel_name.push(channelName);
  }
  showsJson('./egypt_channels_list.json', channels_list)

  await browser.close();
})();
