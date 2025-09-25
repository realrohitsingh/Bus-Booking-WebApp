# Bus Booking App (React Frontend)

This is a modern, responsive frontend for a bus booking application built with React and Vite. It provides a clean user interface for searching bus routes, viewing results, and dynamically handling searches.

## 🚀 Core Features

  * **Dynamic Route Search:** Search for buses by specifying "From" and "To" locations.
  * **Search by Bus Name:** Use the navigation bar to search directly for a specific bus operator.
  * **Custom Autocomplete Dropdown:** User-friendly city inputs with real-time filtering and dropdown suggestions.
  * **Virtual Bus Generation:** If no direct bus route is found in the database, the app cleverly generates a "virtual" bus for that route to enhance user experience.
  * **Date Picker:** Select the date of travel, ensuring users cannot select past dates.
  * **Responsive Design:** A clean and modern UI that works seamlessly across desktop, tablet, and mobile devices using modern CSS.
  * **State Management with Hooks:** Efficiently manages application state using React Hooks like `useState`, `useEffect`, and `useRef`.

## 🛠️ Technology Stack

  * **Frontend:** React.js, Vite
  * **Styling:** Modern CSS3 with CSS Variables and Media Queries
  * **Mock Backend:** `json-server` to serve static `data.json`

## ⚙️ Setup and Installation

To get this project up and running on your local machine, follow these steps.

**1. Clone the Repository**

```bash
git clone https://github.com/your-username/Bus-Booking-WebApp.git
cd Bus-Booking-WebApp/bus-app
```

**2. Install Dependencies**
This will install all the necessary packages for React and Vite.

```bash
npm install
```

**3. Set Up the Mock API**
This application fetches data from a local mock API. We'll use `json-server` to serve the `data.json` file.

  * **Install json-server:**
    ```bash
    npm install -g json-server
    ```
  * **Start the JSON server:**
    Run this command from the `bus-app` directory. It will watch your `data.json` file and serve it on port 1000.
    ```bash
    json-server --watch src/database/data.json --port 1000
    ```
    You should see a message confirming that the server is running. Leave this terminal open.

**4. Run the React Application**
Open a **new terminal** in the `bus-app` directory and run the following command to start the Vite development server.

```bash
npm run dev
```

The application should now be running and accessible at `http://localhost:5173` (or another port if 5173 is busy).

-----

## Explanation of the Code

Your project is a great example of a modern single-page application built with React. Here’s a breakdown of how the key parts work.

### 1\. Project Structure

  * `public/`: Contains static assets that don't need to be processed by the build tool, like `favicon.ico`.
  * `src/`: This is where all your source code lives.
      * `database/data.json`: Acts as your mock database. It contains a list of cities and predefined bus routes.
      * `BBW.jsx`: The main React component that contains all the logic and JSX for your application.
      * `BBW.css`: The stylesheet for your main component, which defines the entire look and feel.
      * `main.jsx`: The entry point of your React application. It renders the main `BusBookingWebsite` component into the DOM.
  * `package.json`: Defines the project's dependencies (like React) and scripts (like `npm run dev`).
  * `vite.config.js`: Configuration file for Vite, the build tool used for this project.

-----

### 2\. Core Functionality (`BBW.jsx`)

The entire application logic is contained within the `BusBookingWebsite` and `CityInput` components.

#### **State Management with `useState`**

The component uses multiple `useState` hooks to manage its state:

  * `buses` & `cities`: Store the data fetched from the `data.json` file.
  * `from`, `to`, `date`: Store the user's input from the search form.
  * `filtered`: An array that holds the search results to be displayed.
  * `hasSearched`: A boolean flag to track whether a search has been performed. This is used to conditionally render either the welcome message or the search results.

<!-- end list -->

```jsx
function BusBookingWebsite() {
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [filtered, setFiltered] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  // ...
}
```

#### **Data Fetching with `useEffect`**

When the component first mounts, the `useEffect` hook runs once. It makes an asynchronous `fetch` call to the local JSON server (`http://localhost:1000/products`) to get the bus and city data and stores it in the state.

```jsx
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
}, []); // The empty array [] ensures this runs only once
```

#### **Search Logic (`handleSearch`)**

This function is the heart of the route search feature.

1.  It first validates that the "From" and "To" cities are valid and not the same.
2.  It filters the `buses` array to find real routes that match the user's query.
3.  **Virtual Bus Generation**: If no real routes are found (`realResults.length` is 0), it calls `generateVirtualBus` to create a fake bus listing for that route. This is a fantastic feature because the user always gets a result, improving the perceived functionality of the app.
4.  It updates the `filtered` state with the results and sets `hasSearched` to `true` to trigger the UI to show the results.

<!-- end list -->

```jsx
const handleSearch = () => {
  if (from && to && from !== to /*...validations*/) {
    const realResults = buses.filter(/*...*/);

    let finalResults = [];
    if (realResults.length > 0) {
      finalResults = realResults;
    } else {
      // The clever fallback!
      finalResults = [generateVirtualBus(from, to, date)];
    }
    setFiltered(finalResults);
    setHasSearched(true);
  }
};
```

#### **`CityInput` - The Reusable Autocomplete Component**

This is a custom, reusable component designed for entering city names.

  * **Filtering:** It maintains its own `filteredCities` state, which updates in real-time as the user types.
  * **Dropdown Control:** It uses `useState` to manage the visibility (`isOpen`) of the dropdown menu.
  * **Click Outside to Close:** The `useEffect` hook with `useRef` is a classic React pattern to detect clicks outside the component. When an outside click is detected, it closes the dropdown (`setIsOpen(false)`), which is a great UX touch.

<!-- end list -->

```jsx
function CityInput({ label, value, onChange, cities, onKeyUp }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // This effect handles closing the dropdown if the user clicks elsewhere
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  // ... rest of the component
}
