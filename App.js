
// API Key - Replace 'YOUR_API_KEY' with your actual API key
const apiKey = '2ULLRZ37RYB2LP7M';
const baseURL = 'https://www.alphavantage.co/query';

const watchlist = document.getElementById('watchlist');
const stockSymbolInput = document.getElementById('stockSymbol');

const createCard = (symbol, timeframe) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <h3>${symbol}</h3>
    <p>Timeframe: ${timeframe}</p>
    <button class="delete-btn">Delete</button>
  `;
  card.addEventListener('click', () => showDataModal(symbol, timeframe));
  card.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteCard(symbol, timeframe);
  });
  return card;
};

const addToWatchlist = (symbol, timeframe) => {
  const card = createCard(symbol, timeframe);
  watchlist.appendChild(card);
};

const deleteCard = (symbol, timeframe) => {
  const cardToDelete = [...watchlist.children].find(card => card.textContent.includes(symbol));
  watchlist.removeChild(cardToDelete);
};

const showDataModal = async (symbol, timeframe) => {
  const response = await fetch(`${baseURL}?function=TIME_SERIES_${timeframe}&symbol=${symbol}&apikey=${apiKey}`);
  const data = await response.json();

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${symbol} (${timeframe})</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
      <button class="delete-btn">Close</button>
    </div>
  `;

  modal.querySelector('.delete-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  document.body.appendChild(modal);
};

document.querySelectorAll('.timeframe-btn').forEach(button => {
  button.addEventListener('click', () => {
    const timeframe = button.getAttribute('data-timeframe');
    const symbol = stockSymbolInput.value.trim().toUpperCase();
    if (symbol !== '') {
      addToWatchlist(symbol, timeframe);
      stockSymbolInput.value = '';
    }
  });
});
