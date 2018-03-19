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
  landscape: true,
  No: Array(24),
  flip: Array(24),
  search: Array(3)
};

const arrangement = [
  [2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 5, 5, 5, 6],
  [2, 3, 2, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6],
  [0, 0, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6],
  [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 5, 5, 5, 6]
];

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
  
  resetBoard();

  drawingCards();
  
  setingCards();
  // set cards

  //let x = 1;


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

// TODO: 
const drawingCards = () => {
  let colection = [];

  for (let i = 0; i < 24; i++){
    cards.No[i] = 0;
  }

  let rnd;
  // fill colection
  for (let i = 1; i <= cards.stakes / cards.couples; i++){
    for (let j = 0; j < cards.couples; j++){
      do {
        rnd = (Math.random() * cards.stakes) | 0;
      } while (cards.No[rnd] != 0);
      cards.No[rnd] = i;
    }
  }
  // drawing of the item
  console.log(cards.No);
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
      let card = $(buildCard(cards.No[index], index));
      // adding click event with prevent dragable
      $(card).children().on("mouseup mousedown", function(event) {
        event.preventDefault();
        if (event.type == "mouseup"){
          flipp(this);
        }
      });

      $(who).append(card);
      index++
    }
  }

  $('.card-box').width(cards.size + 'px');
  $('.card-box').height(cards.size + 'px');

};


const flipp = (sender) => {
  $(sender).toggleClass('flipped');
  console.log(parseInt($(sender).attr('id')));

};


// TODO: The third creates an additional snakes on the canvas

const buildCard = (pattern, index) => {
  pattern = ((pattern < 10) ? '0' : '') + pattern;
  index = ((index < 10) ? '0' : '') + index;
  let card = '';

  card += '<div class="card-box">';
  card += '<div class="card" id="' + index + '">';

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


// TODO: Two functions to operate the hide-away menu

const showMenu = () => {
	document.getElementsByClassName("hamburger")[0].style.display = "none";
	document.getElementsByTagName("aside")[0].style.left = "0";
};

const hideMenu = () => {
	if (document.documentElement.clientWidth <= 765) {
		document.getElementsByClassName("hamburger")[0].removeAttribute("style");
		document.getElementsByTagName("aside")[0].removeAttribute("style");
	}
};
