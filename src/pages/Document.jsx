import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDocumentById } from "../services/documentService";
import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";
import DocumentEditor from "../components/DocumentComponents/DocumentEditor";
import CollaboratorsList from "../components/DocumentComponents/CollaboratorsList";
import VersionHistory from "../components/DocumentComponents/VersionHistroy";
import { socket } from "../services/socket";

export default function Document() {
  const { id } = useParams();
  const { token } = useAuth();
  const { setVersions, setCollaborators } = useDocument();

  useEffect(() => {
    const loadDocument = async () => {
      const doc = await fetchDocumentById(id, token);
      setVersions(doc.versions || []);
    };
    loadDocument();
  }, [id]);

  useEffect(() => {
    const handleCollaborators = (list) => setCollaborators(list);
    socket.on("active-collaborators", handleCollaborators);
    return () => {
      socket.off("active-collaborators", handleCollaborators);
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <DocumentEditor docId={id} token={token} />
      <CollaboratorsList documentId={id} />
      <VersionHistory />
    </div>
  );
}
