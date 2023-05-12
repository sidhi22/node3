import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  ChangeEventHandler,
} from "react";
import { NodeObject } from "react-force-graph-2d";
import { NodeProperties } from "@/types/graph";

interface SearchProps {
  nodes: NodeObject[];
  properties: NodeProperties;
  searchCallback: (node: NodeObject) => void;
}

function NodeSearchBox({ nodes, properties, searchCallback }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(true);
  const [results, setResults] = useState<NodeObject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
    setShowResults(true);
  };

  const handleResultClick = (node: NodeObject) => {
    searchCallback(node);
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.value = properties[node.id as string].label;
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const resultNodes: NodeObject[] = nodes.filter((node: NodeObject) => {
        if (properties[node.id as string]) {
          return properties[node.id as string].label
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase());
        }
      });

      setResults(resultNodes);
    }
  }, [searchTerm]);

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
          {results.map((node: NodeObject) => (
            <li
              key={properties[node.id as string].label}
              onClick={() => handleResultClick(node)}
              className="result-item"
            >
              {properties[node.id as string].label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NodeSearchBox;
