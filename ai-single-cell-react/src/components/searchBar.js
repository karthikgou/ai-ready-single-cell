import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

function SearchBox({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearInput = () => {
    setSearchTerm("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // onSearch(searchTerm);
    console.log("Search Handled");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
    {searchTerm && (
        <button type="button" onClick={handleClearInput}>
        <FontAwesomeIcon icon={faTimes} />
        </button>
    )}

      <button type="submit">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
}

export default SearchBox;
