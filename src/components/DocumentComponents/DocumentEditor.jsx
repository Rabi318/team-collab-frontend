import { useState, useEffect, useRef } from "react";
// import Quill from "quill";
import "quill/dist/quill.snow.css";
import { socket } from "../../services/socket.js";
import { useDocument } from "../../context/DocumentContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import debounce from "../../services/utils.js";

const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
];

export default function DocumentEditor({ docId, token }) {
  const editorRef = useRef();
  const { content, setContent } = useDocument();
  const { user } = useAuth();

  const debouncedSave = debounce((documentId, content, userId) => {
    socket.emit("save-document", { documentId, content, userId });
  }, 1000);

  useEffect(() => {
    let quill;
    // const quill = new Quill(editorRef.current, {
    //   theme: "snow",
    //   modules: {
    //     toolbar: TOOLBAR_OPTIONS,
    //   },
    // });
    import("quill").then(({ default: Quill }) => {
      quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      quill.setText("Loading...");
    });
    socket.auth = { token };
    socket.connect();

    if (user?._id) {
      socket.emit("join-document", {
        documentId: docId,
        userId: user._id,
      });
    }

    socket.on("load-document", (documentContent) => {
      quill.setContents(documentContent);
      quill.enable();
    });

    socket.on("receive-changes", (delta) => {
      quill.updateContents(delta);
    });

    quill.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
      const newContent = quill.getContents();
      // console.log(newContent);
      setContent(newContent);
      debouncedSave(docId, newContent, user._id);
    });

    return () => {
      socket.emit("leave-document", docId);
      socket.disconnect();
    };
  }, [docId, token]);
  return (
    <div className="bg-white" ref={editorRef} style={{ height: "500px" }} />
  );
}
