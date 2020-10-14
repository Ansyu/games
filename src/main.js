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
  ];

  var UP = 'ArrowUp'
  var Down = 'ArrowDown'
  var Left = 'ArrowLeft'
  var Right = 'ArrowRight'

  var ACTIVE_CLASS_NAME = 'active-block'  // 可移动方块的 class 名字
  var BLOCK_SIZE = 20   // 每个小块的大小
  var GAME_WINDOW_WIDTH = 300
  var GAME_WINDOW_HEIGHT = 500
  // var GAME_WINDOW_WIDTH = 120
  // var GAME_WINDOW_HEIGHT = 300

  var INIT_POS_X = 2
  var INIT_POS_Y = 0

  var column = GAME_WINDOW_WIDTH / BLOCK_SIZE
  var row = GAME_WINDOW_HEIGHT / BLOCK_SIZE
  var layout = []
  for (let i = 0; i < row; i++) {
    layout[i] = new Array(column).fill(null)
  }

  var currentBlock = null
  var posX = INIT_POS_X
  var posY = INIT_POS_Y

  function Block() {
    this.posX = INIT_POS_X
    this.posY = INIT_POS_Y
    this.block = this.getRandomBlock()
    this.blockDom = []
  }

  // 获取一个随机方块
  Block.prototype.getRandomBlock = function() {
    var random = parseInt(Math.random() * 7)  // 随机值 0 - 7，用于随机选择一个类型块
    var block = BLOCK[random]
    random = parseInt(Math.random() * 4)  // 随机值 0 - 3，将块随机旋转一定角度
    block = this.rotateBlock(block, random * 90)
    return block
    // return BLOCK[0]
  }

  /**
   * 方块旋转
   * 例如，将下面方块旋转 90 度
   * [                  [
   *   [1, 0],             [0, 1, 1],
   *   [1, 1],   ==>       [1, 1, 0]
   *   [0, 1]           ]
   * ], 
   * @param {*} blockType 
   * @param {*} rotateAngle 
   */
  Block.prototype.rotateBlock = function(blockType, rotateAngle) {
    while (rotateAngle) {
      blockType = this.transpose(blockType)
      rotateAngle -= 90
    }
    return blockType
  }

  // 顺时针变换一次
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
  Block.prototype.render = function(offsetX, offsetY) {
    var gameWindow = document.getElementById('gameWindow')

    // 清除 block
    var divDom = this.blockDom.pop() 
    while(divDom) {
      gameWindow.removeChild(divDom)
      divDom = this.blockDom.pop()
    }

    for (let i = 0; i < this.block.length; i++) {
      let row = this.block[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] === 1) {
          var blockDiv = document.createElement('div')
          var px = offsetX + j
          var py = offsetY + i
          blockDiv.className = ACTIVE_CLASS_NAME
          blockDiv.style.left = px * BLOCK_SIZE + 'px'
          blockDiv.style.top = py * BLOCK_SIZE + 'px'
          blockDiv.pos = {x: px, y: py}
          gameWindow.appendChild(blockDiv)
          this.blockDom.push(blockDiv)
        }
      }
    }
  }

  // 方块移动
  Block.prototype.move = function(direction) {
    switch(direction) {
      case Left:
        this.moveLeft()
        break
      case Right:
        this.moveRight()
        break
      case UP:
        var newBlock = this.rotateBlock(this.block, 90)
        if (!this.isCollision(newBlock)) {
          this.block = newBlock
          this.render(this.posX, this.posY)
        }
        break
      case Down:
        this.moveDown()
        break
    }
    // this.render(this.posX, this.posY)
  }

  // 左移
  Block.prototype.moveLeft = function() {
    if (this.posX - 1 >= 0) {
      this.posX--
      this.render(this.posX, this.posY)
    }
  }

  // 右移
  Block.prototype.moveRight = function() {
    if ((this.posX + this.block[0].length) * BLOCK_SIZE < GAME_WINDOW_WIDTH) { // 右边界
      this.posX++
      this.render(this.posX, this.posY)
    }
  }

  // 下移
  Block.prototype.moveDown = function() {
    if ((this.posY + this.block.length) * BLOCK_SIZE < GAME_WINDOW_HEIGHT) {// 下边界
      this.posY++
      this.render(this.posX, this.posY)
    } else {
      console.log('到底')
      this.blockDom.forEach(function (blockDiv) {
        blockDiv.className = 'inactive-block'
        layout[blockDiv.pos.y][blockDiv.pos.x] = blockDiv
      })
      // 方块消除
      layout.forEach(function(rows) {
        var canDelete = true
        rows.forEach(function(item) {
          if (!item) {
            canDelete = false
          }
        })
        if (canDelete) {
        console.log(layout)
          rows.forEach(function (item) {
            item.parentNode.removeChild(item)
            layout[item.pos.y][item.pos.x] = null
          })
        console.log(layout)
        }
      })

      // 创建新方块
      blockFactory()
    }
  }

  // 是否碰撞已经存在的方块
  Block.prototype.isHitBlock = function(block) {
    
  }

  // 边界检查，是否碰壁
  Block.prototype.isCollision = function(block) {
    return this.posX < 0  ||  // 左边界
        (this.posX + block[0].length) * BLOCK_SIZE > GAME_WINDOW_WIDTH ||  // 右边界
        (this.posY + block.length) * BLOCK_SIZE > GAME_WINDOW_HEIGHT // 下边界
  }

  window.onload = function() {
    init()
  };

  function init() {
    setGameWindowSize(GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT)

    // 添加键盘监听器
    window.addEventListener('keydown', function(event) {
      currentBlock.move(event.key)
    })

    blockFactory()

    document.getElementById('startBtn').onclick = function() {
      console.log('start game')
    }
  }

  function blockFactory() {
    currentBlock = new Block()
    currentBlock.render(posX, posY)
  }

  // 设置游戏框大小
  function setGameWindowSize(width, height) {
    var gameWindow = document.getElementById('gameWindow')
    gameWindow.style.width = width + 'px'
    gameWindow.style.height = height + 'px'
  }

})()
