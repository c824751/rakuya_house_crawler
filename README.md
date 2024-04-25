# 自動爬蟲程式

這是一個自動爬取樂屋網售房資料並將其發送到 Telegram Bot 和 Google 試算表的程式。這個程式是使用 JavaScript 編寫的 Google Apps Script，用於自動化爬蟲和資料處理。

## 使用前提

- 需要使用 Google Apps Script 運行此程式。
- 需要有有效的 Telegram Bot Token 和 Chat ID，以便將爬取的數據發送到 Telegram。
- 需要一個 Google 帳號和 Google 雲端硬碟，以便將數據存儲到 Google 試算表中。

## 功能特性

- 爬取指定網站的數據，並進行處理和篩選。
- 將篩選後的數據通過 Telegram Bot 發送到指定的聊天。
- 將數據存儲到 Google 試算表中，以便進一步分析和處理。

## 配置步驟

1. **設置 Telegram Bot**

   - 創建一個 Telegram Bot，獲取 Bot Token。
   - 獲取需要將數據發送的 Chat ID。

2. **設置 Google 試算表**

   - 創建一個 Google 試算表，添加工作表用於存儲爬取的數據。

3. **修改程式碼**

   - 將 Telegram Bot Token 和 Chat ID 填入程式碼中的 `data` 配置部分。
   - 將 Google 試算表的工作表名稱填入程式碼中的 `data` 配置部分。

4. **部署程式碼**

   - 將程式碼複製粘貼到 Google Apps Script 中。
   - 部署為 Web 應用程式，獲取 URL。

5. **設置定時任務**

   - 使用 Google Apps Script 的觸發器功能，設置定時任務，定期執行爬取操作。

## 示例程式碼說明

- `data`：配置要爬取的網站 URL、Telegram Bot Token、Chat ID 和 Google 試算表工作表名稱等信息。
- `main`：主函數，用於執行爬取和處理數據的流程。
- 其他輔助函數：用於處理 HTML、發送 Telegram 訊息、操作 Google 試算表等功能。

## 注意事項

- 程式中包含了一些延遲和異常處理，以避免過度請求和錯誤。
- 請確保對爬取的網站和發送到 Telegram 的訊息進行合法使用，遵守相關的法律法規和使用協議。

## 技術支援

如有任何疑問或需要進一步的幫助，請隨時聯繫。

---

希望這份 README 模板能幫助您更好地了解和使用自動爬蟲程式。祝您使用愉快！
