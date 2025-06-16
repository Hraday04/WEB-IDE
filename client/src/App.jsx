import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Terminal from "./components/terminal";
import FileTree from "./components/tree";
import socket from "./socket";
import AceEditor from "react-ace";

import { getFileMode } from "./utils/getFileMode";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);

  const isSaved = selectedFileContent === code;

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const containerHeight = document.querySelector('.playground-container').clientHeight;
      const newHeight = containerHeight - e.clientY;
      if (newHeight > 100 && newHeight < containerHeight - 200) {
        setTerminalHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const getFileName = (path) => {
    if (!path) return "";
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="playground-container">
      <div className="header">
        <div className="logo">Code Compiler</div>
      </div>
      
      <div className="main-content">
        <div className="editor-container">
          <div className="files">
            <div className="file-tree-header">
              <span>Explorer</span>
              <button onClick={getFileTree}>↻</button>
            </div>
            <FileTree
              onSelect={(path) => {
                setSelectedFileContent("");
                setSelectedFile(path);
              }}
              tree={fileTree}
              selectedFile={selectedFile}
            />
          </div>
          
          <div className="editor">
            {selectedFile ? (
              <>
                <div className="editor-header">
                  <div className="file-path">
                    {getFileName(selectedFile)}
                    <span className={`file-status ${isSaved ? 'status-saved' : 'status-unsaved'}`}>
                      {isSaved ? " ● Saved" : " ● Unsaved"}
                    </span>
                  </div>
                  <div>{selectedFile.replaceAll("/", " > ")}</div>
                </div>
                <AceEditor
                  mode={getFileMode({ selectedFile })}
                  theme="tomorrow_night_eighties"
                  value={code}
                  onChange={(e) => setCode(e)}
                  name="code-editor"
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'var(--text-secondary)',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
                <p>Select a file to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div 
        className="resizer-horizontal" 
        onMouseDown={handleMouseDown}
      ></div>
      
      <div className="terminal-container" style={{ height: terminalHeight + 'px' }}>
        <div className="terminal-header">
          <div className="terminal-title">Terminal</div>
        </div>
        <Terminal />
      </div>
    </div>
  );
}

export default App;