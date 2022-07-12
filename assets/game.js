const selectors = {
  boardContainer: document.querySelector('.board-container'),
  board: document.querySelector('.board'),
  moves: document.querySelector('.moves'),
  timer: document.querySelector('.timer'),
  start: document.querySelector('button'),
  win: document.querySelector('.win')
}

const state = {
  gameStarted: false,
  flippedCards: 0,
  totalFlips: 0,
  totalTime: 0,
  loop: null
}

const shuffle = array => {
  const clonedArray = [...array]

  for (let index = clonedArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const original = clonedArray[index]
    clonedArray[index] = clonedArray[randomIndex]
    clonedArray[randomIndex] = original
  }

  return clonedArray
}

const pickRandom = (array, items) => {
  const clonedArray = [...array]
  const randomPicks = []

  for (let index = 0; index < items; index++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length)
    randomPicks.push(clonedArray[randomIndex])
    clonedArray.splice(randomIndex, 1)
  }

  return randomPicks
}

const generateGame = (emojis) => {
  const dimensions = selectors.board.getAttribute('data-dimension')

  if (dimensions % 2 !== 0) {
    throw new Error("The dimension of the board must be an even number.")
  }

  const picks = pickRandom(emojis, (dimensions * dimensions) / 2)
  const items = shuffle([...picks, ...picks])
  const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card" data-id="${item}">
                    <div class="card-front"></div>
                    <div class="card-back"><img style="width:100%; max-width: 100%; height: auto;" src="${item}"/></div>
                </div>
            `).join('')}
       </div>
    `

  const parser = new DOMParser().parseFromString(cards, 'text/html')

  selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
  state.gameStarted = true
}

const flipBackCards = () => {
  document.querySelectorAll('.card:not(.matched)').forEach(card => {
    card.classList.remove('flipped')
  })

  state.flippedCards = 0
}

const flipCard = card => {
  state.flippedCards++
  state.totalFlips++

  if (!state.gameStarted) {
    startGame()
  }

  if (state.flippedCards <= 2) {
    card.classList.add('flipped')
  }

  if (state.flippedCards === 2) {
    const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
    if (flippedCards[0].getAttribute('data-id') === flippedCards[1].getAttribute('data-id')) {
      flippedCards[0].classList.add('matched')
      flippedCards[1].classList.add('matched')

      setTimeout(() => {
        flippedCards[0].classList.add('animate__animated')
        flippedCards[0].classList.add('animate__tada')
        flippedCards[1].classList.add('animate__animated')
        flippedCards[1].classList.add('animate__tada')
      }, 600)
    }

    setTimeout(() => {
      flipBackCards()
    }, 1000)
  }

  // If there are no more cards that we can flip, we won the game
  if (!document.querySelectorAll('.card:not(.flipped)').length) {
    setTimeout(() => {
      selectors.boardContainer.classList.add('flipped')
      clearInterval(state.loop)
    }, 1000)
  }
}

const attachEventListeners = () => {

  document.querySelectorAll('.card').forEach(item => {
    item.addEventListener('click', event => {
      const eventTarget = event.target
      const eventParent = eventTarget.parentElement
      if (!eventParent.className.includes('flipped')) {
        flipCard(eventParent)
      }
    })
  })

  /*document.addEventListener('click', event => {
      const eventTarget = event.target
      const eventParent = eventTarget.parentElement

      if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
          flipCard(eventParent)
      } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
          startGame()
      }
  })*/
}

generateGame([
  'mini-1.png',
  'mini-2.png',
  'mini-3.png',
  'mini-4.png',
  'mini-5.png',
  'mini-6.png',
  'mini-7.png',
  'mini-8.png',
  'mini-9.png',
  'mini-10.png',
  'mini-11.png',
  'mini-12.png',
  'mini-13.png',
  'mini-14.png',
  'mini-15.png',
  'mini-16.png',
  'mini-17.png',
  'mini-18.png',
  'mini-19.png',
  'mini-20.png',
  'mini-21.png',
  'mini-22.png',
  'mini-23.png',
  'mini-24.png',
])
attachEventListeners();
window.parent.postMessage('ready')


