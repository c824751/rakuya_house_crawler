樂屋網售房自動爬蟲程式說明文件
這份程式是一個用於自動爬取樂屋網售房資料並將其發送到 Telegram Bot 和 Google 試算表的程式。它是用 JavaScript 編寫的 Google Apps Script，用於 Google 試算表的自動化。

使用方法
設置 data 變數：在程式的開始處，可以定義要爬取的網站資訊。。可以設置以下屬性：
url：要爬取的網站 URL。
telegramBotToken：Telegram Bot 的令牌 (Token)，用於發送訊息。
telegramChatId：Telegram 聊天 ID，指定訊息要發送到哪個聊天。
sheetName：Google 試算表的工作表名稱，用於將資料存儲到這個工作表中。
triggerTime：指定何時觸發爬取，目前已註解掉，可以根據需要啟用。
main 函數：這是程式的入口點，它會遍歷 data 中的每個網站配置，然後爬取資料並執行後續操作。

其他幫助函數：
getPageCount：從 HTML 中獲取總頁數。
getPageItems：解析 HTML 並提取每個項目的資料。
checkDuplicateItem：檢查項目是否重複，避免重複發送到 Telegram 和重複存儲到試算表中。
processItem：解析單個項目的 HTML，獲取標題、連結、價格等資料。
sendToTelegramBot：將訊息通過 Telegram Bot 發送到指定的聊天。
insertRows：將資料插入到指定 Google 試算表的工作表中。

注意事項
請確保設置了 Google Apps Script 環境並將程式碼複製到該環境中。
確保已設置 Telegram Bot 並獲取了相應的 Token 和聊天 ID。
確保 Google 試算表已設置並有指定的工作表名稱，並且已授權 Google Apps Script 訪問此試算表。
運行頻率
程式中包含了一些延遲，用於避免對目標網站和 Telegram API 的過度請求，請根據需要調整這些延遲時間。
附加說明
如需更多技術支援或說明，請隨時聯繫我們，我們很樂意提供協助。

這份說明文件可以幫助您更好地理解程式的運作方式和配置方法。希望對您有所幫助！






