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
  // var GAME_WINDOW_WIDTH = 300
  // var GAME_WINDOW_HEIGHT = 500
  var GAME_WINDOW_WIDTH = 120
  var GAME_WINDOW_HEIGHT = 300

  var INIT_POS_X = 2
  var INIT_POS_Y = 0

  var COLUMN = GAME_WINDOW_WIDTH / BLOCK_SIZE
  var ROW = GAME_WINDOW_HEIGHT / BLOCK_SIZE

  var currentBlock = null
  var grid = []  // grid，用于记录已下落方块的 DOM 对象


  window.onload = function() {
    initGame()
  };

  function initGame() {
    setGameWindowSize(GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT)

    grid = initGrid(ROW, COLUMN)

    currentBlock = blockFactory()

    // 添加键盘监听器，控制方块的移动与变换
    window.addEventListener('keydown', function(event) {
      currentBlock.move(event.key)
    })

    document.getElementById('startBtn').onclick = function() {
      console.log('start game')
    }
  }

  function clear(grid) {
    grid.forEach(function (rows, rowIndex) {
      rows && rows.forEach(function (column, columnIndex) {
        if (column) {
          column.parentNode.removeChild(column)
          grid[rowIndex][columnIndex] = null
        }
      })
    })
  }

  // 新建一个方块
  function blockFactory() {
    var block = new Block()
    block.render(block.posX, block.posY)
    return block
  }

  // 设置游戏框大小
  function setGameWindowSize(width, height) {
    var gameWindow = document.getElementById('gameWindow')
    gameWindow.style.width = width + 'px'
    gameWindow.style.height = height + 'px'
  }

  // 方块消除
  function eraseBlock() {
    grid.forEach(function(rows) {
      var canDelete = true
      rows.forEach(function(item) {
        if (!item) {
          canDelete = false
        }
      })
      if (canDelete) {
        let posY = rows[0].pos.y
        rows.forEach(function (item) {
          item.parentNode.removeChild(item)
          grid[item.pos.y][item.pos.x] = null
        })
        autoFall(posY)
      }
    })
  }

  // 清除满行方块后，上面的方块自动下落
  function autoFall(posY) {
    for (let i = posY - 1; i >= 0; i--) {
      grid[i].forEach(function (item) {
        if (item) {
          item.pos.y++
          item.style.top = item.pos.y * BLOCK_SIZE + 'px'
        }
      })
      grid[i + 1] = grid[i]
    }
    grid[0] = new Array(COLUMN).fill(null)
  }

  function initGrid(row, column) {
    var gridArr = []
    for (let i = 0; i < row; i++) {
      gridArr[i] = new Array(column).fill(null)
    }
    return gridArr
  }

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
      case Down:
        this.moveDown()
        break
      case UP:
        var newBlock = this.rotateBlock(this.block, 90)
        if (!this.isCollision(newBlock) && !this.isHitBlock(newBlock, {x: this.posX, y: this.posY})) {
          this.block = newBlock
          this.render(this.posX, this.posY)
        }
        break
    }
  }

  // 左移
  Block.prototype.moveLeft = function() {
    if (this.posX - 1 >= 0 &&
      !this.isHitBlock(this.block, {x: this.posX-1, y: this.posY})
      ) {
      this.posX--
      this.render(this.posX, this.posY)
    }
  }

  // 右移
  Block.prototype.moveRight = function() {
    if ((this.posX + this.block[0].length) * BLOCK_SIZE < GAME_WINDOW_WIDTH &&  // 右边界
      !this.isHitBlock(this.block, {x: this.posX+1, y: this.posY})
    ) { 
      this.posX++
      this.render(this.posX, this.posY)
    }
  }

  // 下移
  Block.prototype.moveDown = function() {
    if ((this.posY + this.block.length) * BLOCK_SIZE < GAME_WINDOW_HEIGHT && // 下边界
      !this.isHitBlock(this.block, {x: this.posX, y: this.posY+1})
    ) {
      this.posY++
      this.render(this.posX, this.posY)
    } else {
      console.log('到底')
      this.blockDom.forEach(function (blockDiv) {
        blockDiv.className = 'inactive-block'
        grid[blockDiv.pos.y][blockDiv.pos.x] = blockDiv
      })

      eraseBlock()

      setTimeout(() => {
        // 创建新方块
        currentBlock = blockFactory()

        if (currentBlock.isHitBlock(currentBlock.block, {x: currentBlock.posX, y: currentBlock.posY})) {
          alert('game over')
          
          // 清空游戏中所有方块
          clear(grid)
        }
      }, 0)

    }
  }

  // 是否碰撞已经存在的方块
  Block.prototype.isHitBlock = function(block, pos) {
    let hit = false
    block.forEach(function (row, rowIndex) {
      row.forEach(function (column, columnIndex) {
        if (column === 1 && grid[pos.y + rowIndex][pos.x + columnIndex]) {
          hit = true
        }
      })
    })
    return hit
  }

  // 边界检查，是否碰壁
  Block.prototype.isCollision = function(block) {
    return this.posX < 0  ||  // 左边界
        (this.posX + block[0].length) * BLOCK_SIZE > GAME_WINDOW_WIDTH ||  // 右边界
        (this.posY + block.length) * BLOCK_SIZE > GAME_WINDOW_HEIGHT // 下边界
  }

})()
