<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>雙人線上圍棋 - P2P 版</title>
  <!-- 引入 PeerJS SDK -->
  <script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: "Segoe UI", Microsoft JhengHei, sans-serif;
      background-color: #f0f2f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    .back-link {
      align-self: flex-start;
      max-width: 1000px;
      margin: 0 auto 15px auto;
      width: 100%;
    }
    .back-link a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: bold;
    }
    .back-link a:hover {
      text-decoration: underline;
    }
    h1 {
      margin-bottom: 20px;
      color: #333;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      max-width: 1000px;
      width: 100%;
    }
    /* 連線與狀態面板 */
    .panel {
      background: #ffffff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      flex: 1;
      min-width: 300px;
    }
    .panel-section {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .panel-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    input[type="text"] {
      width: 100%;
      padding: 8px 12px;
      margin: 8px 0;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    button {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
      width: 100%;
      margin-top: 5px;
    }
    button:hover {
      background-color: #4338ca;
    }
    .status-box {
      background: #f8fafc;
      border-left: 4px solid #4f46e5;
      padding: 10px;
      margin-top: 10px;
      border-radius: 4px;
      font-size: 14px;
      color: #334155;
      white-space: pre-line;
    }
    /* 棋盤容器 */
    .board-container {
      background-color: #dc9b41;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    }
    canvas {
      display: block;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- 返回大廳連結 -->
  <div class="back-link">
    <a href="../../index.html">← 返回遊戲大廳</a>
  </div>

  <h1>雙人 P2P 線上圍棋</h1>

  <div class="container">
    <!-- UI 面板 -->
    <div class="panel">
      <div class="panel-section">
        <h3>1. 你的房號 (建立對局)</h3>
        <p style="margin-top:5px;">房號：<strong id="my-id">連線中...</strong></p>
        <button onclick="copyShareLink()">複製邀請連結</button>
      </div>

      <div class="panel-section">
        <h3>2. 加入對手房間</h3>
        <input type="text" id="join-id-input" placeholder="貼上對手的房號">
        <button onclick="joinGame()">連線到對手</button>
      </div>

      <div class="panel-section">
        <h3>3. 對局狀態</h3>
        <div class="status-box" id="status-text">初始化中...</div>
        <div class="status-box" id="turn-text" style="margin-top:8px;">身份：尚未連線</div>
      </div>
    </div>

    <!-- 棋盤 Canvas -->
    <div class="board-container">
      <canvas id="board" width="580" height="580"></canvas>
    </div>
  </div>

  <!-- 引入同目錄下的遊戲邏輯 -->
  <script src="game.js"></script>
</body>
</html>
