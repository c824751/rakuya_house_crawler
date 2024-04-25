

const data = [
  
    // 安平區
  {    
    url: "https://www.rakuya.com.tw/sell/result?city=14&zipcode=708&price=0~1800&typecode=R1&sort=30&browsed=0",
    telegramBotToken: "YOUR_BOT_TOKEN",
    telegramChatId: "YOUT_CHAT_ID",
    sheetName: "708",
    triggerTime: "9"
  },
  {    
    url: "https://www.rakuya.com.tw/sell/result?city=14&zipcode=708&price=0~499&typecode=R2&sort=30&browsed=0",
    telegramBotToken: "YOUR_BOT_TOKEN",
    telegramChatId: "YOUT_CHAT_ID",
    sheetName: "708",
    triggerTime: "10"
  },
]
const existItemsMap = {}
function main() {
  data.forEach(subArray => {
    const { url, telegramBotToken, telegramChatId, sheetName, triggerTime } = subArray

    const currentTime = new Date();
    // if (!(currentTime.getHours() == triggerTime)) return

    let html = Ifetch(url).replaceAll(/\r?\n/g,"")
    let pageCount = getPageCount(html)
    console.log("pageCount: " + pageCount)
    if(!pageCount) return
    let items = []
    for(let nowPage = 1; nowPage <= pageCount; nowPage++){//PageCount-7
    
      console.log("nowPage: " + nowPage)
      let nowHtml = Ifetch(`${url}&page=${nowPage}`)
      delay(3500);
      const pageItems = getPageItems(nowHtml, sheetName)
      items.push(...pageItems)
    }
    const messages = itemToMessage(items);
    sendToTelegramBot(telegramBotToken, telegramChatId, messages)
    sheetItems = getSheetType(sheetName, items)
    insertRows(sheetName, sheetItems)
  });
}
function getSheetType(sheetName, items){
  let listSheet = getSheet(sheetName);
  let header = listSheet.getRange("A1:J1").getValues()[0]; // 用來檢查的欄位
  saveToSheetList = []
  items.forEach((i)=>{
    const temp = []
    header.map(h=>{
      temp.push(i[h])
    })
    saveToSheetList.push(temp)
  })
  return saveToSheetList
}
function getPageCount(html){
  return html.match(/第\s*\d+\s*\/\s*(\d+)\s*頁/)?.[1]
}
function insertRows(sheetName, sheetItems){
  let listSheet = getSheet(sheetName);
  sheetItems.forEach(i=>listSheet.appendRow(i))
}
function getExistItems(sheetName) {
  let listSheet = getSheet(sheetName);
  let typeArray = listSheet.getRange("A2:J").getValues(); // 用來檢查的欄位
  const existItemHash = new Set()
  typeArray.forEach((row)=>{
    row[5] = (row[5]) ? row[5] : "1"
    existItemHash.add(`${row[3]}${row[5]}${row[6]}`)//price	floor area
  })
  return existItemHash
}
function getPageItems(html, sheetName){
  const itemsHtml = html.match(/<section[^>]*>[\s\S]*?<\/section>/g)
  const items = []
  itemsHtml.forEach(item=>{
    const _item = processItem(item)
    const isDuplicateItem = checkDuplicateItem(_item, sheetName)
    if(!isDuplicateItem)items.push(_item)
  })
  return items;
}

function checkDuplicateItem(item, sheetName){
  if(!existItemsMap[sheetName]){
    existItemsMap[sheetName] = getExistItems(sheetName)
  }
  
  item["floor"] = (item["floor"]) ? item["floor"] : "1"
  const duplicateKey = `${item["price"]}${item["floor"]}${item["area"]}`
  // 比對items內有重複就回傳 true
  isDuplicate = existItemsMap[sheetName].has(duplicateKey)
  if(!isDuplicate) existItemsMap[sheetName].add(duplicateKey)
  return isDuplicate
}

function processItem(itemHtml){
  const title = itemHtml.match(/<div class="card__head">\s*<h2>(.+?)<\/h2>\s*<\/div>/)?.[1];
  const ehid = itemHtml.match(/data-ehid="([^"]+)"/)?.[1];
  const infoDetailInfo = itemHtml.match(/<div class="info__detail-info">([\S\s]*?)<\/div>/)?.[1];
  // 統一改成一欄位
  // let detailType, detailPattern, detailAge;
  let detail;
  if(infoDetailInfo){
    const lis = infoDetailInfo.match(/<li>(.+?)<\/li>/g).map(i=>i.replace(/<\/?li>/g, ''))
    detail = lis.join(' ');
  }

  const price = itemHtml.match(/<span class="info__price--total">\s*<b>(.+?)<\/b>/)?.[1];
  const community = itemHtml.match(/<span class="info__geo--community"[^>]*>([^<]+)<\/span>/)?.[1];
  const address =  itemHtml.match(/<span class="info__geo--road">(.+?)<\/span>/)?.[1];
  const floor =  itemHtml.match(/<li class="info__floor">(.+?)<\/li>/)?.[1];
  const area = itemHtml.match(/<li class="info__space">\s*<span class="info__space--title">總建<\/span>(.+?)坪\s*<\/li>/)?.[1];
  const priceUnit = (price/area).toFixed(1);
  const addressCommunity = (community) ? community : address;
  const link = `https://www.rakuya.com.tw/sell_item/info?ehid=${ehid}`
  const time = new Date()
  // { 標題 連結 型態	總價 社區 樓層 地址 坪數 單價 ID	
  return {
    title,
    link,
    detail,
    price,
    addressCommunity, 
    floor,
    area,
    priceUnit,
    ehid,
    time
  }
}
function getSheet(sheetName){
  return  SpreadsheetApp.getActive().getSheetByName(sheetName);
}

function sendToTelegramBot(telegramBotToken, telegramChatId, messages) {
  const telegram_api_url = `https://api.telegram.org/bot${telegramBotToken}/`;
  for(let i =0;i<messages.length;i++){
    const payload = {
      "method": "sendMessage",
      "chat_id": telegramChatId,
      "text" : messages[i],
      'parse_mode': 'HTML',
    };

    const options = {
      "method": "post",
      "payload": payload,
      "muteHttpExceptions": true,
    };
    try {
      Ifetch(telegram_api_url, options);
      delay(1000)
    } catch (error) {
      console.error(error);
    }
  }
}

function itemToMessage(items){
  return items.map(i=>
    [
    `<a href="${i.link}">${i.title}</a>`, 
    `${i.detail} ${i.floor}`, 
    `${i.addressCommunity}`,
    `坪數: ${i.area} 坪`, 
    `總價: ${i.price} 萬`, 
    `單價: ${i.priceUnit} 萬/坪`
    ].join("\n")
  )
}

async function delay(ms){
  Utilities.sleep(ms);
}

function Ifetch(url, parms = null, retry = 0) {
    const response = parms ? UrlFetchApp.fetch(url, { muteHttpExceptions: true, ...parms }) : UrlFetchApp.fetch(url, { muteHttpExceptions: true })
    delay(100);
    var responseCode = response.getResponseCode()
    if (responseCode >= 200 && responseCode < 300) {
      return response.getContentText().trim()
    }
    if (responseCode >= 300) {
      if (retry > 2) {
        console.log(url)
        throw new Error(JSON.stringify({responseCode, msg:response.getContentText().trim()}))
      }
      delay(2000);
      return Ifetch(url, parms, retry + 1)
    }
}
