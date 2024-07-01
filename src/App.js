import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const authors = [
  "Albert Einstein", "Marilyn Monroe", "Abraham Lincoln", "Mother Teresa", 
  "John F. Kennedy", "Martin Luther King Jr.", "Nelson Mandela", "Winston Churchill",
  "Bill Gates", "Steve Jobs", "Mahatma Gandhi", "Mark Twain", "Oscar Wilde",
  "Confucius", "Leonardo da Vinci", "Aristotle", "Plato", "Socrates"
];

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [quoteStyle, setQuoteStyle] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthors, setShowAuthors] = useState(false);

  useEffect(() => {
    getQuote();
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const getQuote = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://api.quotable.io/random');
      const randomColor = generateRandomColor();
      setQuote(response.data.content);
      setAuthor(response.data.author);
      setQuoteStyle({ backgroundColor: randomColor });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchQuotes = async (searchTerm) => {
    setIsLoading(true);
    try {
      const trimmedTerm = searchTerm.trim();
      const encodedTerm = encodeURIComponent(trimmedTerm);
      const response = await axios.get(`https://api.quotable.io/quotes?author=${encodedTerm}`);
      const results = response.data.results;
      if (results.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.length);
        const randomQuote = results[randomIndex];
        setQuote(randomQuote.content);
        setAuthor(randomQuote.author);
        setQuoteStyle({ backgroundColor: generateRandomColor() });
      } else {
        setQuote("No quotes found for this author.");
        setAuthor("");
      }
      const updatedHistory = [...searchHistory, trimmedTerm];
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchQuotes(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setQuote('');
    setAuthor('');
  };

  const toggleAuthorList = () => {
    setShowAuthors(!showAuthors);
  };

  return (
    <div className="App">
      <div className="search-bar-container">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search by Author Name" 
            onChange={handleSearch} 
            value={searchTerm} 
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      <button className="button" onClick={getQuote}>Get Random Quote</button>
      <button className="button" onClick={toggleAuthorList}>
        {showAuthors ? "Hide Author List" : "Show Author List"}
      </button>
      {isLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : null}
      {quote ? (
        <div className="quote-container">
          <div className="quote-box" style={quoteStyle}>
            <p className="quote"><b>"</b> {quote} <b>"</b></p>
            {author && <p className="author">-{author}</p>}
          </div>
          <button className="clear-button" onClick={clearSearch}>Clear Search</button>
        </div>
      ) : null}
      {showAuthors && (
        <div className="author-list">
          <h2>Available Authors</h2>
          <ul>
            {authors.map((author, index) => (
              <li key={index}>{author}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
