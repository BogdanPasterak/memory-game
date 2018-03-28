/* myScript
* Bogdan Pasterak
* TODO: sctipt support Memory Game Udacity project
* 12/3/2018
*/

// Variables used in the game
const cards = {
  board: undefined,
  couples: 0,
  stakes: 0,
  col: 0,
  row: 0,
  size: 0,
  moves: 0,
  time: 0,
  intervalID: undefined,
  intervalOvations: undefined,
  landscape: true,
  No: Array(24),
  flipp: Array(24),
  search: Array(3),
  sizeHat: 70,
  rectAudience: undefined,
  rectBoard: undefined
};
// An array with the layout of cards
const arrangement = [
  [2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 5, 5, 5, 6],
  [2, 3, 2, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6],
  [0, 0, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6],
  [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 5, 5, 5, 6]
];
// Tables with values ​​of shifting in keyframes
const moveX = [-577, -397, -181, -67, -23, 31, 73, 197, 401, 619];
const moveY = [520, 440, 360, 290, 230, 170, 100];
     
// Calculation of some game parameters
cards.set = function() {
  this.couples = parseInt($('#couples').val());
  this.stakes = parseInt($('#stakes').val());
  this.col = 2 + (this.stakes > 6) + (this.stakes > 12);  // true == 1, false == 0
  this.row = 2 + (this.stakes > 4) + (this.stakes > 9) + (this.stakes > 16) + (this.stakes > 20);
  this.landscape = ($(this.board).width() > $(this.board).height());
  // calculate size of cards
  const cW = this.board.clientWidth / ((this.landscape) ? this.row : this.col);
  const cH = this.board.clientHeight / ((this.landscape) ? this.col : this.row);
  this.size = ((cW > cH) ? cH : cW) | 0;
};


// TODO: Registration of new events and initialization
$(function() {

  // Handle for the playing field
  cards.board = $('.board')[0];
  // spreading the elements of the game (for phones in the landscape position )
  $( window ).resize(function() {
    reorganization();
  });
  // events for button and selects
  $('button').click(function() {
    restart();
  });
  $('#couples').change(function() {
    choiceCouples();
  });
  $('#stakes').change(function() {
    choiceStakes();
  });
  // start !
  reorganization();
  choiceCouples();
});

// TODO: resize window ( turning the phone )
const reorganization = () => {
  const playground = $('.playground')[0];

  // putting playground to the side
  if ($(window).width() > $(window).height() && $(window).width() < 820) {
   if ($(playground)[0].parentElement.classList.value == 'my-col-left') {
      $('.my-col-left')[0].style.width = "40%";
      $('.my-col-right')[0].style.width = "56%";
      $('.my-col-right')[0].append(playground);
    }
  } else {
  // or back
   if ($(playground)[0].parentElement.classList.value == 'my-col-right') {
      $('.my-col-left')[0].style.width = "96%";
      $('.my-col-right')[0].style.width = "0";
      $('footer')[0].before(playground);
    }
  }
  // smaller screen, smaller hat
  if ($(window).width() < 700 || $(window).height() < 700) {
    cards.sizeHat = 40;
  } else {
    cards.sizeHat = 70;
  }

  // saving the size of audience and board
  cards.rectAudience = $('.audience')[0].getBoundingClientRect();
  cards.rectBoard = $('.board')[0].getBoundingClientRect();

  // repaint screen
  cards.set();
  resetBoard();
  setingCards();
};

// TODO: Select function to choose couples
const choiceCouples = () => {
  const stakesObj = $('#stakes');
  const couples = parseInt($('#couples').val());
  
  // clear list stakes
  $(stakesObj).html('');
  // entering new values
  for (let i = couples * 2; i < 25; i += couples) {
    $(stakesObj).append('<option value="' + i + '">' + i + ' cards</option>')
  }  
  // set option 12, is always !
  $(stakesObj).val('12');
  // call to choiceStakes
  $(stakesObj).trigger("change");
};

// TODO: Select function to choose stakes
const choiceStakes = () => {
  cards.set();
  restart();
};

// TODO: start again
const restart = () => {
  // turn off owation
  if (cards.intervalOvations != undefined) {
    clearInterval(cards.intervalOvations);
    cards.intervalOvations = undefined;
  }
  // draw and set new cards
  resetBoard();
  drawingCards();
  setingCards();
};


// TODO: Function for redrawing the board
const resetBoard = () => {
  // clear board
  $(cards.board).html('');
  // set of cloumns or rows inside board
  for (let i = 0; i < cards.col; i++) {
    $(cards.board).append('<div class="my-' + ((cards.landscape) ? 'row' : 'col') + '"></div>');
  }
  // set their  float
  $(cards.board).css('flex-flow', ((cards.landscape) ? 'column' : 'row'));
  // and size
  if (cards.landscape) {
    $('.my-row').height(cards.size + 'px');
  } else {
    $('.my-col').width(cards.size + 'px');
  }
};

// TODO: drawing cards
const drawingCards = () => {
  let rnd;

  // clear seting
  for (let i = 0; i < 24; i++){
    cards.No[i] = 0;
    cards.flipp[i] = false;
  }
  cards.search[2] = -1;          
  cards.search[1] = -1;          
  cards.search[0] = -1;
  cards.moves = 0;
  cards.time = 0;
  // stop clock
  if (cards.intervalID != undefined) {
    clearInterval(cards.intervalID);
    cards.intervalID = undefined;
  }
  // clear visible elements
  $('#moves').html('0');
  $('#time').html('0:00');
  calcStars();

  // fill colection
  for (let i = 1; i <= cards.stakes / cards.couples; i++){
    // i -> number of sets
    for (let j = 0; j < cards.couples; j++){
      // j -> card number in the set
      do {
        rnd = (Math.random() * cards.stakes) | 0;
      } while (cards.No[rnd] != 0);
      // draw until you find an empty space
      cards.No[rnd] = i;
    }
  }
};

// TODO: setting cards according to the pattern
const setingCards = () => {
  // to which row or column to add (string of class and no.)
  let who; 
  // index in the pattern
  const which = (((cards.stakes - 4) / 2) | 0) + (cards.stakes > 8) + (cards.stakes > 14) + (cards.stakes > 20);
  // index of card
  let index = 0;

  for (let i = 0; i < cards.col; i++){
    // i -> cloumn or row (depending on the view)
    who = '.my-' + ((cards.landscape) ? 'row' : 'col') + ':eq(' + i + ')';
    for (let j = 0; j < arrangement[i][which]; j++) {
      // j -> position in a row or column
      // creates a card
      let card = $(buildCard(index));
      // adding click event with prevent dragable
      $(card).children().on("mouseup mousedown", function(event) {
        event.preventDefault();
        if (event.type == "mouseup"){
          flipp(this);
        }
      });
      // set card
      $(who).append(card);
      index++
    }
  }
  // set size of cards
  $('.card-box').width(cards.size + 'px');
  $('.card-box').height(cards.size + 'px');
};

// TODO: Card rollover function
const flipp = (sender) => {
  // variable
  const index = parseInt($(sender).attr('id'));
  const front = ! cards.flipp[index];
  let id0, id1, id2;

  // if I check
  if (front){
    // next move
    cards.moves++;
    // show muves
    $('#moves').html(cards.moves);
    // turn the card
    $(sender).toggleClass('flipped');
    cards.flipp[index] = front;
    // start clock if stoped
    if (cards.intervalID == undefined ){
      cards.intervalID = setInterval(addSecond, 1000);
    }
    // are they any reversed ?
    if (cards.search[0] >= 0) {
      // if the first one is the same ?
      if (cards.No[index] == cards.No[cards.search[0]]) {
        // all included ?
        if (cards.couples == 2 || (cards.couples == 3 && cards.search[1] >= 0) || (cards.couples == 4 && cards.search[1] >= 0 && cards.search[2] >= 0)) {
          // reset the search
          cards.search[2] = -1;          
          cards.search[1] = -1;          
          cards.search[0] = -1;
          // hurra
          for (let i = 0; i < ((Math.random() * 10) | 0) + 7; i++) {
            setTimeout(function() {
              throwHat();
            },(Math.random() * 1500) | 0);
          }
          // is this the last set ?
          if ($('.flipped').length == cards.stakes) {
            // stop clock
            if (cards.intervalID != undefined) {
              clearInterval(cards.intervalID);
              cards.intervalID = undefined;
            }
            // ovations !!!
            if (cards.intervalOvations == undefined ){
              cards.intervalOvations = setInterval(ovations, 200);
            }
            win();
          }         
        } else {
        // not all in the set, enter and search further
          if (cards.search[1] == -1) {
            // second
            cards.search[1] = index;
          } else {
            // or third
            cards.search[2] = index;
          }
        }
      } else {
      // not the same
        // id of previous searches
        id0 = leadingZero(cards.search[0]);
        if (cards.couples > 2 && cards.search[1] >= 0) {
          id1 = leadingZero(cards.search[1]);
        }
        if (cards.couples == 4 && cards.search[2] >= 0) {
          id2 = leadingZero(cards.search[2]);
        }
        // cover the wrong one
        setTimeout(function() {
          $(sender).toggleClass('flipped');
          $('#' + id0).toggleClass('flipped');
          if (id1 != undefined) {
            $('#' + id1).toggleClass('flipped');
          }        
          if (id2 != undefined) {
            $('#' + id2).toggleClass('flipped');
          }        
        }, 600);
        // start searching again
        cards.flipp[index] = false;
        cards.flipp[cards.search[0]] = false;
        cards.search[0] = -1;
        if (id1 != undefined) {
          cards.flipp[cards.search[1]] = false;
          cards.search[1] = -1;
        }        
        if (id2 != undefined) {
          cards.flipp[cards.search[2]] = false;
          cards.search[2] = -1;
        }    
        // the audience can also be wrong !!!!
        if (Math.random() < 0.2) {
          throwHat();
        }    
      }
    // start looking for a pair
    } else {
      cards.search[0] = index;
    }
  }

};

// TODO: Creates a card
const buildCard = (nr) => {
  const pattern = leadingZero(cards.No[nr]);
  const index = leadingZero(nr);
  let card = '';

  card += '<div class="card-box">';
  card += '<div class="card';
  // if it was rotated, turn it
  if (cards.flipp[nr]){
    card += ' flipped';
  }
  card += '" id="' + index + '">';

  card += '<figure class="back">';
  card += '<img src="img/bowl.png">';
  card += '</figure>';

  card += '<figure class="front">';
  card += '<img src="img/fruti' + pattern + '.png">';
  card += '</figure>';
  
  card += '</div>'; // end card
  card += '</div>'; // end card-box
  return card;
};

// TODO: Time counting timer
const addSecond = () => {
  let time, min, sec;

  cards.time++;
  time = (cards.time / 3600) | 0;
  min = ((cards.time % 3600) / 60 ) | 0;
  sec = cards.time % 60;

  time = ((time == 0) ? min : time + ':' + leadingZero(min)) + ':' + leadingZero(sec);
  // show time  
  $('#time').html(time);
  // also show stars
  calcStars();
};

// TODO: Drowing a stars
const calcStars = (nr) => {
  const place = $('.stars');
  let stars;
  let star;

  // fewer stars if you're too slow ( 2 sec per move)
  stars = ((cards.time / cards.moves) / 2) | 0;
  // fewer stars if too many missed ones
  stars += (cards.moves / (cards.stakes * 1.7)) | 0;
  // max 3
  stars = 3 - stars;
  // set stars
  $(place).html('');
  for ( let i = 0; i < 3; i++) {
    if (stars > 0) {
      stars--;
      star = $('<i class="fas fa-star"></i>');
    } else {
      star = $('<i class="far fa-star"></i>');
    }
    $(place).append(star);
  }
};

// TODO: Adds a leading zero
const leadingZero = (nr) => {
  return ((nr < 10) ? '0' : '') + nr;
};

// TODO: throw a hat from the audience
const throwHat = () => {

  let hat, box, hatX, hatY, div;
  let drowX, drowY, rotate, kind, x, y;

  // drawing of flight parameters and hat
  do {
    drowX = (Math.random() * 10) | 0;
  } while ( cards.rectAudience.width - cards.sizeHat < Math.abs(moveX[drowX]) );
  do {
    drowY = (Math.random() * 7) | 0;
  } while ( cards.rectAudience.y < moveY[drowY] );
  rotate = (Math.random() * 4) | 0;
  kind = (Math.random() * 10) | 0;
  // flight within the limits of playground
  x = (cards.rectAudience.width - Math.abs(moveX[drowX]) - cards.sizeHat) * Math.random();
  x = (x + cards.rectAudience.x - ((moveX[drowX] < 0) ? moveX[drowX] : 0)) | 0;
  y = (cards.rectAudience.y + cards.rectAudience.height - cards.sizeHat * (1 + Math.random())) | 0;

  //console.log('los =' + moveX[drowX] + '  pole=' + cards.rectAudience.width + '  x=' + x);

  // building next divs
  // box with positioning start
  box = $('<div class="hat-box" style="left: ' + x + 'px; top: ' + y + 'px;"></div>');
  // divs for horizontal and vertical movement
  hatX = $('<div class="hat-X" style="animation-name: moveX' + drowX + ';"></div>');
  hatY = $('<div class="hat-Y" style="animation-name: moveY' + drowY + ';"></div>');
  // div with a cap, turnover and dimensions
  div = '<div class="hat" style="';
  div += 'width: ' + cards.sizeHat + 'px;';
  div += 'height: ' + cards.sizeHat + 'px;';
  div += 'animation-name: moveR' + rotate + ';';
  div += 'background-image: url(\'img/hat' + kind + '.png\');';
  div += '"></div>';
  hat = $(div);

  // adding divs
  $(box).append(hatX);
  $(hatX).append(hatY);
  $(hatY).append(hat);

  // remove the hat after the flight
  setTimeout(function() {
    $(box).remove();
  }, 990);
  // throw !!!
  $(cards.board).append(box);
};


// TODO: throw caps all the time
const ovations = () => {

  setTimeout(function() {
    throwHat();
  }, (Math.random() * 300) | 0);
};

// TODO: victory
const win = () => {
  const again = $('<div class="win"></div>');
  const inside = $('<div class="again"></div>)');
  const btn = $('<button class="btn-again"> AGAIN ! </button>');

  $(inside).append($('<p>YOU WON !!</p>'));
  $(inside).append($('<p>Your result: <strong class="stars"></strong></p>'));
  $(inside).append($('<p></p>').text('Your moves: ' + cards.moves ));
  $(inside).append($('<p></p>').text('Your time: ' + $('#time').text()));
  $(inside).append(btn);

  $(btn).click(function() {
    $('.container')[0].style.filter = '';
    restart();
    $(again).remove();
  });

  again.append(inside);

  $('.container')[0].style.filter = 'blur(2px)';

  $('body').append(again);

  // show stars
  calcStars();

};