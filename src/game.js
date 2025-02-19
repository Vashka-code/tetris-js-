export default class Game {

  static points = {
    '1': 40,
    '2': 100,
    '3': 300,
    '4': 1200
  };


  
  constructor() {
    this.reset();
  }
  get level() {
    return Math.floor(this.lines * 0.1)
  }

  getState() {
    const playfield = this.createPlayfield();

    const {
      y: pieceY,
      x: pieceX,
      blocks
    } = this.activePiece;

    for (let y = 0; y < this.playfield.length; y++) {
      playfield[y] = [];
      for (let x = 0; x < this.playfield[y].length; x++) {
        playfield[y][x] = this.playfield[y][x];
      }
    }

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
      nextPiece: this.nextPiece,
      playfield,
      isGameOver: this.topOut
    }
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this.topOut = false;
    this.playfield = this.createPlayfield();
    this.activePiece = this.createPiece();
    this.nextPiece = this.createPiece();
  }

  createPlayfield() {
    const playfield = [];
    for (let y = 0; y < 20; y++) {
      playfield[y] = []
      for (let x = 0; x < 10; x++) {
        playfield[y][x] = 0;
      }
    }
    return playfield;
  }

  createPiece() {
    const index = Math.floor(Math.random() * 7);
    const type = 'IJLOSTZ' [index];
    const piece = {};

    switch (type) {
      case 'I':
        piece.blocks = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
        break;
      case 'J':
        piece.blocks = [
          [0, 0, 0],
          [2, 2, 2],
          [0, 0, 2]
        ]
        break;
      case 'L':
        piece.blocks = [
          [0, 0, 0],
          [3, 3, 3],
          [3, 0, 0]
        ]
        break;
      case 'O':
        piece.blocks = [
          [0, 0, 0, 0],
          [0, 4, 4, 0],
          [0, 4, 4, 0],
          [0, 0, 0, 0]
        ]
        break;
      case 'S':
        piece.blocks = [
          [0, 0, 0],
          [0, 5, 5],
          [5, 5, 0]
        ]
        break;
      case 'T':
          piece.blocks = [
            [0, 0, 0],
            [6, 6, 6],
            [0, 6, 0]
          ]
        break;
      case 'Z':
          piece.blocks = [
            [0, 0, 0],
            [7, 7, 0],
            [0, 7, 7]
          ]
        break;

      default:
        throw new Error('Неизвестный тип');
    }

    piece.x = Math.floor((10 - piece.blocks[0].length)/2);
    piece.y = -1;

    return piece;
  }

  movePieceLeft() {
    this.activePiece.x -= 1;
    if (this.hasCollision()) {
      this.activePiece.x += 1;
    }
  }
  movePieceRight() {
    this.activePiece.x += 1;
    if (this.hasCollision()) {
      this.activePiece.x -= 1;
    }
  }
  movePieceDown() {
    if(this.topOut) return

    this.activePiece.y += 1;
    if (this.hasCollision()) {
      this.activePiece.y -= 1;
      this.lookPiece();
      const clearLines = this.clearLines();
      this.updateScore(clearLines);
      this.updatePieces();
    }


    if(this.hasCollision()){
      this.topOut = true;
    }
  }
  rotatePiece() {
    const blocks = this.activePiece.blocks;
    const length = blocks.length;
    const temp = [];
    for (let i = 0; i < length; i++) {
      temp[i] = new Array(length).fill(0);
    }
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        temp[x][y] = blocks[length - 1 - y][x];
      }
    }
    this.activePiece.blocks = temp;
    if (this.hasCollision()) {
      this.activePiece.blocks = blocks;
    }



  }
  hasCollision() {
    const {
      y: pieceY,
      x: pieceX,
      blocks
    } = this.activePiece;
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (
          blocks[y][x] &&
          ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) ||
            this.playfield[pieceY + y][pieceX + x])
        ) {
          return true;
        }
      }
    }
    return false;
  }
  lookPiece() {
    const {
      y: pieceY,
      x: pieceX,
      blocks
    } = this.activePiece;
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
  }

  clearLines() {
    const rows = 20;
    const columns = 10;
    let lines = [];

    for (let y = rows - 1; y >= 0; y--) {
      let numberOfBlocks = 0;
      for (let x = 0; x < columns; x++) {
        if(this.playfield[y][x]){
          numberOfBlocks++;
        }
      }
      if(numberOfBlocks === 0){
        break;
      } else if (numberOfBlocks < columns){
        continue;
      } else if (numberOfBlocks === columns){
        lines.unshift(y);
      }
    }
    for(let index of lines){
      this.playfield.splice(index, 1);
      this.playfield.unshift(new Array(columns).fill(0));
    }
    return lines.length;
  }

  updateScore(cliaridLines) {
    if(cliaridLines > 0){
      this.score += Game.points[cliaridLines] * (this.level + 1);
      this.lines += cliaridLines;
    }
  }

  updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  }
}