import React, { useState, useEffect, useRef } from "react";
import "./BBW.css";

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function CityInput({ label, value, onChange, cities, onKeyUp }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities);
  const containerRef = useRef(null);

  useEffect(() => {
    const results = cities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(results);
  }, [value, cities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const selectCity = (city) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className="city-input-container" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        placeholder={label}
        onFocus={() => setIsOpen(true)}
        onKeyUp={onKeyUp}
      />
      <button className="dropdown-arrow" onClick={() => setIsOpen(!isOpen)}>
        ▼
      </button>
      {isOpen && (
        <div className="city-dropdown">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <div
                key={city}
                className="dropdown-item"
                onClick={() => selectCity(city)}
              >
                {city}
              </div>
            ))
          ) : (
            <div className="dropdown-item-empty">No cities found</div>
          )}
        </div>
      )}
    </div>
  );
}

function BusBookingWebsite() {
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [filtered, setFiltered] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [navSearchTerm, setNavSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("route");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:1000/products");
        const data = await res.json();
        setBuses(data.bus);
        setCities(data.cities);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const generateVirtualBus = (fromCity, toCity, travelDate) => {
    const templateBus = buses[Math.floor(Math.random() * buses.length)];
    const randomPrice = (
      Math.floor(Math.random() * (1500 - 400 + 1)) + 400
    ).toFixed(2);
    const [year, month, day] = travelDate.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    return {
      ...templateBus,
      id: `virtual-${Date.now()}`,
      from: fromCity,
      to: toCity,
      date: formattedDate,
      price: randomPrice,
    };
  };

  const handleSearch = () => {
    if (
      from &&
      to &&
      from !== to &&
      cities.includes(from) &&
      cities.includes(to)
    ) {
      const realResults = buses.filter(
        (bus) =>
          bus.from.toLowerCase() === from.toLowerCase().trim() &&
          bus.to.toLowerCase() === to.toLowerCase().trim()
      );

      let finalResults = [];

      if (realResults.length > 0) {
        finalResults = realResults;
      } else {
        finalResults = [generateVirtualBus(from, to, date)];
      }

      setFiltered(finalResults);
      setHasSearched(true);
      setSearchType("route");
      setNavSearchTerm("");
    } else {
      if (from && to && from === to) {
        alert("Departure and destination cities cannot be the same.");
      } else {
        alert(
          "Please select valid departure and destination cities from the list."
        );
      }
    }
  };

  const handleNavSearch = () => {
    if (navSearchTerm.trim()) {
      const results = buses.filter((bus) =>
        bus.name.toLowerCase().includes(navSearchTerm.toLowerCase().trim())
      );
      setFiltered(results);
      setHasSearched(true);
      setSearchType("name");
      setFrom("");
      setTo("");
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNavKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNavSearch();
    }
  };

  const clearSearch = () => {
    setHasSearched(false);
    setFiltered([]);
    setFrom("");
    setTo("");
    setNavSearchTerm("");
  };

  return (
    <>
      <nav>
        <div className="nav-left">
          <img
            src="https://imgs.search.brave.com/AwSDILYphL28R53W3Uc5A0BERm5eXzNn2tLzYKSe2RI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0L2Nk/LzFjLzE0Y2QxYzlm/MTA4MGZiNzUwMDY2/MzdmMjU1OGMyNTI2/LmpwZw"
            alt="logo"
          />
        </div>
        <div className="nav-links">
          <a href="#">My Trips</a>
          <a href="#">Offers</a>
          <a href="#">Help</a>
        </div>
        <div className="nav-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by bus name..."
              value={navSearchTerm}
              onChange={(e) => setNavSearchTerm(e.target.value)}
              onKeyUp={handleNavKeyPress}
            />
            <button onClick={handleNavSearch}>Search</button>
          </div>
          <div className="auth-buttons">
            <button className="btn-login">Log In</button>
            <button className="btn-signup">Sign Up</button>
          </div>
        </div>
      </nav>
      <section>
        <div className="search-form">
          <CityInput
            label="From"
            value={from}
            onChange={setFrom}
            cities={cities}
            onKeyUp={handleKeyPress}
          />
          <button className="swap-btn" onClick={handleSwap}>
            ⇄
          </button>
          <CityInput
            label="To"
            value={to}
            onChange={setTo}
            cities={cities}
            onKeyUp={handleKeyPress}
          />
          <input
            type="date"
            value={date}
            min={getTodayString()}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={handleSearch} className="search-button">
            Search Buses
          </button>
        </div>
        <div className="bus-results">
          {!hasSearched ? (
            <div className="welcome-message">
              <h1>Find Your Perfect Bus</h1>
              <p>
                Enter your departure and destination cities above to search for
                available buses
              </p>
              <div className="search-tips">
                <h3>🚌 Quick Tips:</h3>
                <ul>
                  <li>
                    Enter city names exactly as they appear in our system
                  </li>
                  <li>
                    Use the swap button (⇄) to quickly exchange departure and
                    destination
                  </li>
                  <li>Select your travel date for better results</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <h1>
                {filtered.length > 0
                  ? `Available Buses (${filtered.length})`
                  : "No Buses Found"}
              </h1>
              {filtered.length > 0 ? (
                <div className="search-info">
                  {searchType === "route" ? (
                    <p>
                      Showing buses from <strong>{from}</strong> to{" "}
                      <strong>{to}</strong>
                    </p>
                  ) : (
                    <p>
                      Showing results for "<strong>{navSearchTerm}</strong>"
                    </p>
                  )}
                  <button className="clear-search" onClick={clearSearch}>
                    Clear Search
                  </button>
                </div>
              ) : null}
              {filtered.length > 0 ? (
                <ul>
                  {filtered.map((bus) => (
                    <li key={bus.id}>
                      <img src={bus.image} alt={bus.name} />
                      <div className="bus-details">
                        <h3>{bus.name}</h3>
                        <p>
                          Route: {bus.from} → {bus.to}
                        </p>
                        <p>
                          Date:{" "}
                          {searchType === "route"
                            ? new Date(date).toLocaleDateString("en-GB")
                            : bus.date}
                        </p>
                        <p>
                          Price: ₹{bus.price} | Seats: {bus.seats} available
                        </p>
                        <p className="bus-description">{bus.desc}</p>
                      </div>
                      <button className="book-button">Book Now</button>
                    </li>
                  ))}
                </ul>
              ) : hasSearched ? (
                <div className="no-results">
                  <h3>🚌 No buses found for this search</h3>
                  <p>
                    Try searching for a different route or check if the names
                    are spelled correctly.
                  </p>
                  <button className="new-search-btn" onClick={clearSearch}>
                    Start New Search
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
export default BusBookingWebsite;