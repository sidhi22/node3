import React, { useState, useEffect, useRef } from "react";

function NodeSearchBox({ nodes, searchCallback }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(true);
  const inputRef = useRef(null);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    setShowResults(true);
  };

  const handleResultClick = (node) => {
    searchCallback(node);
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.value = node.Preferred_Full_Name;
    }
  };

  const results = searchTerm
    ? nodes.filter((node) =>
        node.Preferred_Full_Name.toLowerCase().includes(
          searchTerm.toLocaleLowerCase()
        )
      )
    : [];

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search"
        onChange={handleChange}
      />
      {showResults && (
        <ul className="result-list">
          {results.map((node) => (
            <li
              key={node.Preferred_Full_Name}
              onClick={() => handleResultClick(node)}
              className='result-item'
            >
              {node.Preferred_Full_Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NodeSearchBox;
