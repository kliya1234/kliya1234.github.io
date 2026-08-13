// =========================================================
// 1. 全域變數與圍棋邏輯設定
// =========================================================
const BOARD_SIZE = 19;
let board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0)); // 0:空, 1:黑, 2:白
let lastMove = null; // 紀錄最後落子 [x, y]

// Canvas 繪圖設定
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const padding = 25;
const cellSize = (canvas.width - padding * 2) / (BOARD_SIZE - 1);

// P2P 連線狀態
function generateShortId(length = 6) {
  const chars = '0123456789'; // 若想要英數混合，可改為 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 產生一個 6 位數房號
const customRoomId = generateShortId(6);

// 2. 將產生的簡短房號傳入 PeerJS
const peer = new Peer(customRoomId, {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  }
});

// 3. 錯誤處理 (包含防撞號機制)
peer.on('error', (err) => {
  if (err.type === 'unavailable-id') {
    // 如果不幸跟全域其他使用者撞號，自動重新整理換一個新房號
    console.warn("房號被佔用，重新產生中...");
    location.reload();
  } else {
    document.getElementById('my-id').innerText = "連線失敗";
    updateStatus(`伺服器連線失敗 (${err.type})，請重新整理或重開網路。`);
  }
});

// =========================================================
// 2. Canvas 棋盤與棋子繪製
// =========================================================
function drawBoard() {
  // 繪製木質底色
  ctx.fillStyle = '#dc9b41';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 繪製網格線
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  for (let i = 0; i < BOARD_SIZE; i++) {
    // 橫線
    ctx.beginPath();
    ctx.moveTo(padding, padding + i * cellSize);
    ctx.lineTo(canvas.width - padding, padding + i * cellSize);
    ctx.stroke();

    // 直線
    ctx.beginPath();
    ctx.moveTo(padding + i * cellSize, padding);
    ctx.lineTo(padding + i * cellSize, canvas.height - padding);
    ctx.stroke();
  }

  // 繪製星位
  const starPoints = [3, 9, 15];
  ctx.fillStyle = '#333333';
  for (let x of starPoints) {
    for (let y of starPoints) {
      ctx.beginPath();
      ctx.arc(padding + x * cellSize, padding + y * cellSize, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 繪製所有棋子
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] !== 0) {
        drawStone(x, y, board[y][x]);
      }
    }
  }

  // 繪製最後落子的紅點提示
  if (lastMove) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(padding + lastMove[0] * cellSize, padding + lastMove[1] * cellSize, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStone(x, y, color) {
  const px = padding + x * cellSize;
  const py = padding + y * cellSize;
  const radius = cellSize * 0.45;

  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);

  // 立體光澤漸層
  const gradient = ctx.createRadialGradient(
    px - radius * 0.3, py - radius * 0.3, radius * 0.1,
    px, py, radius
  );

  if (color === 1) { // 黑子
    gradient.addColorStop(0, '#666666');
    gradient.addColorStop(1, '#000000');
  } else { // 白子
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#d1d5db');
  }

  ctx.fillStyle = gradient;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fill();
  ctx.shadowColor = 'transparent';
}

// =========================================================
// 3. 圍棋規則核心 (算氣、提子、禁自殺)
// =========================================================
function getGroupAndLiberties(boardState, startX, startY) {
  const color = boardState[startY][startX];
  if (color === 0) return { group: [], liberties: 0 };

  const visited = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(false));
  const queue = [[startX, startY]];
  visited[startY][startX] = true;

  const group = [];
  const libertiesSet = new Set();
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    group.push([cx, cy]);

    for (let [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
        if (boardState[ny][nx] === 0) {
          libertiesSet.add(`${nx},${ny}`);
        } else if (boardState[ny][nx] === color && !visited[ny][nx]) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }
  }

  return { group, liberties: libertiesSet.size };
}

function tryMove(x, y, color) {
  if (board[y][x] !== 0) return false;

  board[y][x] = color;
  const opponentColor = color === 1 ? 2 : 1;
  let capturedAny = false;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // 檢查敵方氣盡提子
  for (let [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === opponentColor) {
      const { group, liberties } = getGroupAndLiberties(board, nx, ny);
      if (liberties === 0) {
        for (let [gx, gy] of group) {
          board[gy][gx] = 0;
        }
        capturedAny = true;
      }
    }
  }

  // 禁自殺點判斷
  if (!capturedAny) {
    const { liberties } = getGroupAndLiberties(board, x, y);
    if (liberties === 0) {
      board[y][x] = 0;
      return false;
    }
  }

  lastMove = [x, y];
  return true;
}

// =========================================================
// 4. P2P 網路通訊 (PeerJS)
// =========================================================
peer.on('open', (id) => {
  document.getElementById('my-id').innerText = id;
  updateStatus("已連線至 Peer 伺服器，等待對手加入...");

  // 自動解析邀請連結 ?room=xxx
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room');
  if (roomId) {
    document.getElementById('join-id-input').value = roomId;
    joinGame(roomId);
  }
});

// 房主：對手連入
peer.on('connection', (c) => {
  if (conn) {
    c.close();
    return;
  }
  conn = c;
  myColor = 1;       // 房主為黑棋
  isMyTurn = true;   // 黑棋先下
  setupDataListener();
  updateStatus("已有對手連入！遊戲開始。");
  updateTurnUI();
});

// 客端：連線房主
function joinGame(targetId) {
  const hostId = targetId || document.getElementById('join-id-input').value.trim();
  if (!hostId) return alert("請輸入房號！");

  updateStatus("正在連線至房主...");
  conn = peer.connect(hostId);
  myColor = 2;       // 客端為白棋
  isMyTurn = false;  // 後手
  setupDataListener();
}

function setupDataListener() {
  conn.on('open', () => {
    updateStatus("P2P 連線建立成功！");
    updateTurnUI();
  });

  conn.on('data', (data) => {
    if (data.type === 'MOVE') {
      if (tryMove(data.x, data.y, data.color)) {
        isMyTurn = true;
        drawBoard();
        updateTurnUI();
      }
    }
  });

  conn.on('close', () => {
    updateStatus("對手已離線。");
    conn = null;
  });
}

// 點擊下棋
canvas.addEventListener('click', (e) => {
  if (!conn || !isMyTurn) return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const x = Math.round((mx - padding) / cellSize);
  const y = Math.round((my - padding) / cellSize);

  if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
    if (tryMove(x, y, myColor)) {
      drawBoard();
      isMyTurn = false;
      updateTurnUI();

      conn.send({
        type: 'MOVE',
        x: x,
        y: y,
        color: myColor
      });
    }
  }
});

// UI 輔助函式
function updateStatus(msg) {
  document.getElementById('status-text').innerText = msg;
}

function updateTurnUI() {
  const roleStr = myColor === 1 ? "黑子 (先手)" : "白子 (後手)";
  const turnStr = isMyTurn ? "【輪到你下棋】" : "等待對手思考中...";
  document.getElementById('turn-text').innerText = `你的身份：${roleStr}\n狀態：${turnStr}`;
}

function copyShareLink() {
  const myId = document.getElementById('my-id').innerText;
  if (!myId || myId.includes('.')) return alert("請等待房號生成！");

  const shareUrl = `${window.location.origin}${window.location.pathname}?room=${myId}`;
  navigator.clipboard.writeText(shareUrl);
  alert("邀請連結已複製！貼給朋友即可開局對弈。");
}

// 初次載入繪製空白棋盤
drawBoard();
