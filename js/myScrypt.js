/* myScript
* Bogdan Pasterak
* TODO: sctipt support Memory Game Udacity project
* 12/3/2018
*/

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
  landscape: true,
  No: Array(24),
  flipp: Array(24),
  search: Array(3),
  rectAudience: undefined,
  rectBoard: undefined
};

const arrangement = [
  [2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 5, 5, 5, 6],
  [2, 3, 2, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6],
  [0, 0, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6],
  [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 5, 5, 5, 6]
];
const moveX = [-577, -397, -181, -67, -23, 31, 73, 197, 401, 619];
const moveY = [520, 440, 360, 290, 230, 180, 130];

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

  cards.board = $('.board')[0];

  reorganization();

  $( window ).resize(function() {
    reorganization();
  });


  choiceCouples();


  //console.log($('.aaa::after'));

  // $('.aaa::after').css( 'background-image', 'url("../img/hat0.png")');
  // $('.aaa::after').style.backgroundImage = 'url("../img/hat0.png")';

});

// TODO: resize window
const reorganization = () => {
  const playground = $('.playground')[0];

  // putting playground to the side
  if ($(window).width() > $(window).height() && $(window).width() < 820) {
   //console.log("weszedł");
   if ($(playground)[0].parentElement.classList.value == 'my-col-left') {
      $('.my-col-left')[0].style.width = "36%";
      $('.my-col-right')[0].style.width = "60%";
      $('.my-col-right')[0].append(playground);
    }
  } else { // or back
   if ($(playground)[0].parentElement.classList.value == 'my-col-right') {
      $('.my-col-left')[0].style.width = "96%";
      $('.my-col-right')[0].style.width = "0";
      $('footer')[0].before(playground);
    }
  }

  cards.rectAudience = $('.audience')[0].getBoundingClientRect();
  cards.rectBoard = $('.board')[0].getBoundingClientRect();

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

const restart = () => {

  resetBoard();

  drawingCards();
  
  setingCards();

  throwHat();
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
  $('#moves').html('0');
  $('#time').html('0:00');
  calcStars();

  // fill colection
  for (let i = 1; i <= cards.stakes / cards.couples; i++){
    for (let j = 0; j < cards.couples; j++){
      do {
        rnd = (Math.random() * cards.stakes) | 0;
      } while (cards.No[rnd] != 0);
      cards.No[rnd] = i;
    }
  }
};

// TODO: 
const setingCards = () => {
  // to which row or column to add
  let who; 
  // index in the pattern
  const which = (((cards.stakes - 4) / 2) | 0) + (cards.stakes > 8) + (cards.stakes > 14) + (cards.stakes > 20);
  // index of card
  let index = 0;

  for (let i = 0; i < cards.col; i++){
    who = '.my-' + ((cards.landscape) ? 'row' : 'col') + ':eq(' + i + ')';
    for (let j = 0; j < arrangement[i][which]; j++) {
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
  $('.card-box').width(cards.size + 'px');
  $('.card-box').height(cards.size + 'px');
};

// TODO: Card rollover function
const flipp = (sender) => {
  const index = parseInt($(sender).attr('id'));
  const front = ! cards.flipp[index];
  let id0, id1, id2;

  // if I check
  if (front){
    // nastepny ruch
    cards.moves++;
    $('#moves').html(cards.moves);
    
    $(sender).toggleClass('flipped');
    cards.flipp[index] = front;
    // start clock if stoped
    if (cards.intervalID == undefined ){
      cards.intervalID = setInterval(addSecond, 1000);
    }


    // były juz odkryte -- sprawdz
    if (cards.search[0] >= 0) {
      // jesli trafiona
      if (cards.No[index] == cards.No[cards.search[0]]) {
        // chy komplet
        if (cards.couples == 2 || (cards.couples == 3 && cards.search[1] >= 0) || (cards.couples == 4 && cards.search[1] >= 0 && cards.search[2] >= 0)) {
          // jak tak usun sprawdszanie
          cards.search[2] = -1;          
          cards.search[1] = -1;          
          cards.search[0] = -1;
          // hurra
          for (let i = 0; i < ((Math.random() * 10) | 0) + 7; i++) {
            setTimeout(function() {
              throwHat();
            },(Math.random() * 1500) | 0);
          }
          if ($('.flipped').length == cards.stakes) {
            // jesli wszystkie
            if (cards.intervalID != undefined) {
              clearInterval(cards.intervalID);
              cards.intervalID = undefined;
            }
            calcStars();

            console.log('Koniec');
          }         
        } else {
        // nie komplet (2 lub 3) dopisz do odkrytych
          if (cards.search[1] == -1) {
            // ustaw druga
            cards.search[1] = index;
          } else {
            // ustaw trzecia
            cards.search[2] = index;
          }
        }
      } else {
      // nie trafiona
        // czy jest 2 i 3
        id0 = leadingZero(cards.search[0]);
        if (cards.couples > 2 && cards.search[1] >= 0) {
          id1 = leadingZero(cards.search[1]);
        }
        if (cards.couples == 4 && cards.search[2] >= 0) {
          id2 = leadingZero(cards.search[2]);
        }
        // odwroc spowrotem
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
        // odznacz i wykasuj rejestry
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
      }
    // jesli nie zacznij odkrywanaie
    } else {
      cards.search[0] = index;
    }
  }

};

// TODO: Creates a card
const buildCard = (nr) => {
  const pattern = leadingZero(cards.No[nr]);
  const index = ((nr < 10) ? '0' : '') + nr;
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


const addSecond = () => {
  let time, min, sec;

  cards.time++;
  time = (cards.time / 3600) | 0;
  min = ((cards.time % 3600) / 60 ) | 0;
  sec = cards.time % 60;

  time = ((time == 0) ? min : time + ':' + leadingZero(min)) + ':' + leadingZero(sec);
  $('#time').html(time);

  calcStars();
};

// TODO: Drowing a stars
const calcStars = (nr) => {
  const place = $('#stars');
  let stars;
  let star;

  // fewer stars if you're too slow
  stars = (cards.time / cards.moves) | 0;
  // fewer stars if too many missed ones
  stars += (cards.moves / (cards.stakes * 1.4)) | 0;
  stars = 5 - stars;

  $(place).html('');
  for ( let i = 0; i < 5; i++) {
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

// TODO: Adds a leading zero
const throwHat = () => {

  let hat, box, hatX, hatY;
  let drowX, drowY, rotate, kind, x, y;

  do {
    drowX = (Math.random() * 10) | 0;;
  } while ( cards.rectAudience.width < moveX[drowX] );
  do {
    drowY = (Math.random() * 7) | 0;;
  } while ( cards.rectBoard.height + 150 < moveX[drowX] );
  rotate = (Math.random() * 4) | 0;
  kind = (Math.random() * 10) | 0;

  x = (cards.rectAudience.width - Math.abs(moveX[drowX])) * Math.random();
  x = (x * Math.random() + cards.rectAudience.x + ((moveX[drowX] < 0) ? -moveX[drowX] : 0)) | 0;
  y = (cards.rectAudience.y + cards.rectAudience.height - 70 - 80 * Math.random()) | 0;

  //console.log('los =' + moveX[drowX] + '  pole=' + cards.rectAudience.width + '  x=' + x);

  box = $('<div class="hat-box" style="left: ' + x + 'px; top: ' + y + 'px;"></div>');

  hatX = $('<div class="hat-X" style="animation-name: moveX' + drowX + ';"></div>');
  hatY = $('<div class="hat-Y" style="animation-name: moveY' + drowY + ';"></div>');

  hat = $('<div class="hat" style="animation-name: moveR' + rotate + '; background-image: url(\'img/hat' + kind + '.png\');"></div>');

  $(box).append(hatX);
  $(hatX).append(hatY);
  $(hatY).append(hat);


  setTimeout(function() {
    $(box).remove();
  }, 990);

  $('.board').append(box);

};
