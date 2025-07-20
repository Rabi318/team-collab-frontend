import { useDocument } from "../../context/DocumentContext";

export default function VersionHistory() {
  const { versions } = useDocument();

  return (
    <div className="p-2 mt-4 bg-gray-50 border rounded-md">
      <h3 className="font-semibold mb-2">Version History</h3>
      <ul className="text-sm">
        {versions.map((v, idx) => (
          <li key={idx}>
            <strong>{v.editedBy?.name || "Unknown"}</strong>:{" "}
            {new Date(v.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
