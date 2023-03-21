class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];
     
    //extension: call the p5 monosynth library
    this.monoSynth = new p5.MonoSynth();

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
          
        //extension: if the note is active
        if(this.noteState[i][j] == 1) {
            userStartAudio();
            
            //extension: maps x to decide the note sound to play
            //the notes on the left are dull and the notes on the left are sharp
            var note = map(x, 0, img.width, 50, 350);
            
            //extension: maps y to decide the velocity(volume)
            //notes at the top are softer while notes at the bottom are louder
            var velocity = map(y, 0, img.height, 0, 0.5);
            
            //extension: constrain the velocity to between 0 and 1, as that is the argument range
            velocity = constrain(velocity, 0, 1);
            
            //extension: play the sound when notes are interacted
            this.monoSynth.play(note, velocity, 0, 1/6);
        }
          
        if (this.noteState[i][j]>0) {
          var alpha = this.noteState[i][j] * 200;
            
          //extension: changed the colors
          var c1 = color(65, 135, 245, alpha);
          var c2 = color(255, 125, 245, alpha);
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          var s = this.noteState[i][j];
            
          //extension: changed the grid from ellipses to rectangles
          rectMode(CENTER);
          rect(x, y, this.noteSize*s, this.noteSize*s);
        }
        this.noteState[i][j]-=0.05;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }
}
