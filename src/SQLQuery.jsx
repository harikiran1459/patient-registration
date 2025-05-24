import { useState } from "react";
import { db } from "./db";

export default function SQLQuery() {
  const [query, setQuery] = useState("SELECT * FROM patients");
  const [results, setResults] = useState([]);

  const executeQuery = async () => {
    try {
      const res = await db.query(query);
      setResults(res.rows);
    } 
    catch (err) {
      alert(`SQL Error: ${err.message}`);
    }
  };

  return (
    <div>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={3}
      />
      <button onClick={executeQuery}>Run Query</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}