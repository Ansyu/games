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

  var UP = 'ArrowUp'
  var Down = 'ArrowDown'
  var Left = 'ArrowLeft'
  var Right = 'ArrowRight'

  var ACTIVE_CLASS_NAME = 'active-block'  // 可移动方块的 class 名字
  var BLOCK_SIZE = 20   // 每个小块的大小
  var GAME_WINDOW_WIDTH = 300
  var GAME_WINDOW_HEIGHT = 500

  var INIT_POS_X = 2
  var INIT_POS_Y = 0
  function Block() {
    this.posX = INIT_POS_X
    this.posY = INIT_POS_Y
    this.currentBlock = this.getRandomBlock
  }
  Block.prototype.getRandomBlock = function() {
    var random = parseInt(Math.random() * 7)  // 随机值 0 - 7，用于随机选择一个类型块
    var block = BLOCK[random]
    random = parseInt(Math.random() * 4)  // 随机值 0 - 3，将块随机旋转一定角度
    block = this.rotateBlock(block, random * 90)
    return block
  }
  Block.prototype.rotateBlock = function(blockType, rotateAngle) {
    while (rotateAngle) {
      blockType = this.transpose(blockType)
      rotateAngle -= 90
    }
    return blockType
  }
  Block.prototype.transpose = function(matrix) {
    var newMatrix = []
    for (let row = 0; row < matrix.length; row++) {
      for (let column = 0; column < matrix[row].length; column++) {
        if (newMatrix[column] === undefined) {
          newMatrix[column] = []
        }
        newMatrix[column].unshift(matrix[row][column])
      }
    }
    return newMatrix
  }
  // 将方块渲染到 gameWindow 中
  Block.prototype.render = function(block, offsetX, offsetY, needClear = true) {
    var gameWindow = getGameWindow()

    if (needClear) {
      // 清除 block
      var divDom = currentBlockDom.pop() 
      while(divDom) {
        gameWindow.removeChild(divDom)
        divDom = currentBlockDom.pop()
      }
    } else {
      inactiveBlockDom.concat(currentBlockDom)
      currentBlockDom = []
    }

    for (let i = 0; i < block.length; i++) {
      let row = block[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] === 1) {
          var blockDiv = document.createElement('div')
          blockDiv.className = ACTIVE_CLASS_NAME
          blockDiv.style.left = (offsetX + j) * BLOCK_SIZE + 'px'
          blockDiv.style.top = (offsetY + i) * BLOCK_SIZE + 'px'
          gameWindow.appendChild(blockDiv)
          currentBlockDom.push(blockDiv)
        }
      }
    }
  }

  var block = new Block()
  // var currentBlock = getRandomBlock()
  var currentBlock = block.getRandomBlock()
  var currentBlockDom = []
  var posX = INIT_POS_X
  var posY = INIT_POS_Y

  var inactiveBlockDom = [] // 到达底部的块

  window.onload = function() {
    init()
    block.render(currentBlock, posX, posY)
  };

  function init() {
    setGameWindowSize(GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT)

    addKeyListener()

    document.getElementById('startBtn').onclick = function() {
      console.log('start game')
    }
  }

  // 添加键盘监听器
  function addKeyListener() {
    window.addEventListener('keydown', function(event) {
      var newBlock = null
      var isAddBlock = false
      switch(event.key) {
        case Left:
          posX--
          break
        case Right:
          posX++
          break
        case UP:
          newBlock = block.rotateBlock(currentBlock, 90)
          break
        case Down:
          posY++
          break
      }

      if (newBlock) {
        if (!isCollision(newBlock, posX, posY)) {
          currentBlock = newBlock
        }
      } else {
        if (posX < 0) {//左边界
          posX++
        } else if ((posX + currentBlock[0].length) * BLOCK_SIZE > GAME_WINDOW_WIDTH) {// 右边界
          posX--
        } else if ((posY + currentBlock.length) * BLOCK_SIZE > GAME_WINDOW_HEIGHT) {// 下边界
          posY--
          isAddBlock = true

        }
      }
      block.render(currentBlock, posX, posY)
      if (isAddBlock) {
        currentBlock = block.getRandomBlock()
        block.render(currentBlock, INIT_POS_X, INIT_POS_Y, false)
        posX = INIT_POS_X
        posY = INIT_POS_Y
      }
    })
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

  // 返回方块的类型数组, eg:
  // [
  //   [1, 1],
  //   [1, 1]
  // ]
  // function getRandomBlock() {
  //   var random = parseInt(Math.random() * 7)  // 随机值 0 - 7，用于随机选择一个类型块
  //   var block = BLOCK[random]
  //   random = parseInt(Math.random() * 4)  // 随机值 0 - 3，将块随机旋转一定角度
  //   block = rotateBlock(block, random * 90)
  //   return block
  // }

  // 将一个方块顺时针旋转给定角度
  // 例如，将下面方块旋转 90 度
  // [                  [
  //   [1, 0],             [0, 1, 1],
  //   [1, 1],   ==>       [1, 1, 0]
  //   [0, 1]           ]
  // ], 
  // function rotateBlock(blockType, rotateAngle) {
  //   while (rotateAngle) {
  //     blockType = transpose(blockType)
  //     rotateAngle -= 90
  //   }
  //   return blockType
  // }

  // 旋转
  // function transpose(matrix) {
  //   var newMatrix = []
  //   for (let row = 0; row < matrix.length; row++) {
  //     for (let column = 0; column < matrix[row].length; column++) {
  //       if (newMatrix[column] === undefined) {
  //         newMatrix[column] = []
  //       }
  //       newMatrix[column].unshift(matrix[row][column])
  //     }
  //   }
  //   return newMatrix
  // }

  // 是否碰到边界
  function isCollision(block, posX, posY) {
    return posX < 0  ||  // 左边界
        (posX + block[0].length) * BLOCK_SIZE > GAME_WINDOW_WIDTH ||  // 右边界
        (posY + block.length) * BLOCK_SIZE > GAME_WINDOW_HEIGHT // 下边界
  }
})()
