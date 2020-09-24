(function() {
  // 定义 7 种俄罗斯方块类型
  var BLOCK = [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1]
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    [
      [0, 1, 0],
      [1, 1, 1]
    ],
    [
      [1, 1, 1, 1]
    ]
  ]
  var ACTIVE_CLASS_NAME = 'active-block'  // 可移动方块的 class 名字
  var BLOCK_SIZE = 20   // 每个小块的大小

  window.onload = function() {
    init()
    draw(getBlocks(5, 6, 10))
  };

  function init() {
    setGameWindowSize(300, 500)

    document.getElementById('startBtn').onclick = function() {
      console.log('start game')
    }
  }

  // 将方块画到 gameWindow 中
  function draw(blocks) {
    var gameWindow = getGameWindow()
    blocks.forEach(function(block) {
      gameWindow.appendChild(block)
    })
  }

  // 获取方块
  function getBlocks(typeIndex, offsetX, offsetY) {
    var blocks = []
    var blockType = BLOCK[typeIndex]
    for (let i = 0; i < blockType.length; i++) {
      let row = blockType[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] === 1) {
          var block = document.createElement('div')
          block.className = ACTIVE_CLASS_NAME
          block.style.left = (offsetX + j) * BLOCK_SIZE + 'px'
          block.style.top = (offsetY + i) * BLOCK_SIZE + 'px'
          blocks.push(block)
        }
      }
    }
    return blocks
  }

  function getGameWindow() {
    return document.getElementById('gameWindow')
  }

  // 设置游戏框大小
  function setGameWindowSize(width, height) {
    var gameWindow = getGameWindow()
    gameWindow.style.width = width + 'px'
    gameWindow.style.height = height + 'px'
  }
})()
