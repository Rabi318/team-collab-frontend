import { useEffect } from "react";
import { useDocument } from "../../context/DocumentContext";

export default function CollaboratorsList({ documentId }) {
  const { collaborators, fetchCollaborators } = useDocument();

  // console.log("Collab", collaborators);
  useEffect(() => {
    if (documentId) {
      fetchCollaborators(documentId);
    }
  }, [documentId]);
  return (
    <div className="w-full mt-2 sm:max-w-sm md:max-w-md p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
      <h3 className="font-semibold text-base text-gray-800 mb-3">
        Active Collaborators
      </h3>

      {collaborators.length === 0 ? (
        <p className="text-sm text-gray-500">No active collaborators yet.</p>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {collaborators.map((user, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <span className="text-green-500 mr-2 text-xs">●</span>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
