export default class Controller{
  constructor(game, view){
    this.game = game;
    this.view = view;
    this.intervalId = null;
    this.isPlaying = false;

    document.addEventListener('keydown', this.heandleKeyDown.bind(this))
    document.addEventListener('keyup', this.heandleKeyUp.bind(this))

    this.view.renderStartScreen();
  }

  update(){
    this.game.movePieceDown();
    this.updateView();
  }

  play(){
    this.isPlaying = true;
    this.startTaimer();
    this.updateView();
  }
  
  pause(){
    this.isPlaying = false;
    this.stopTaimer();
    this.updateView();
  }

  reset(){
    this.game.reser();
    this.play();
  }

  updateView(){
    const state = this.game.getState()

    if(state.isGameOver){
      this.view.renderEndScreen(state);
    } else if(!this.isPlaying){
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(state);
    }
  }

  startTaimer() {
    const speed = 1000 - this.game.getState().level * 100;

    if(!this.intervalId){
      this.intervalId = setInterval(() => {
        this.update()
      }, speed > 0 ? speed : 100)
    }
  }
  stopTaimer() {
    if(this.intervalId){
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  heandleKeyDown(){
    const state =  this.game.getState();
    switch (event.keyCode) {

      case 13: // Enter
        if(state.isGameOver){
          this.reset;
        } else if(this.isPlaying){
          this.pause();
        } else {
          this.play();
          this.updateView();
        }
        break;
      case 37: //left
        this.game.movePieceLeft();
        this.updateView();
        break;
      case 38: //up
        this.game.rotatePiece();
        this.updateView();
        break;
      case 39: //right
        this.game.movePieceRight();
        this.updateView();
        break;
      case 40: //down
        this.stopTaimer();
        this.game.movePieceDown();
        this.updateView();
        break;
    }
  }
  heandleKeyUp(event) {
    switch (event.keyCode) {
      case 40: //down
        this.startTaimer();
        break;
    }
  }
}