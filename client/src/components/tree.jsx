import React, { useState } from "react";

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L10 1H3.5C2.67 1 2 1.67 2 2.5V13.5C2 14.33 2.67 15 3.5 15H12.5C13.33 15 14 14.33 14 13.5V5.5C14 5.22 13.78 5 13.5 5H10V1.5C10 1.22 9.78 1 9.5 1H10L13.5 4.5Z" fill="currentColor" />
  </svg>
);

const FolderIcon = ({ isOpen }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {isOpen ? (
      <path d="M14.5 4H8.5L7 2.5H1.5C0.67 2.5 0 3.17 0 4V12C0 12.83 0.67 13.5 1.5 13.5H14.5C15.33 13.5 16 12.83 16 12V5.5C16 4.67 15.33 4 14.5 4Z" fill="currentColor" />
    ) : (
      <path d="M14.5 4H7.5L6 2.5H1.5C0.67 2.5 0 3.17 0 4V12C0 12.83 0.67 13.5 1.5 13.5H14.5C15.33 13.5 16 12.83 16 12V5.5C16 4.67 15.33 4 14.5 4ZM14.5 12H1.5V5.5H14.5V12Z" fill="currentColor" />
    )}
  </svg>
);

const FileTreeNode = ({ fileName, nodes, onSelect, path, selectedFile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDir = !!nodes;
  const isSelected = path === selectedFile;
  
  const toggleDir = (e) => {
    e.stopPropagation();
    if (isDir) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (!isDir) {
      onSelect(path);
    } else {
      toggleDir(e);
    }
  };

  // Skip node_modules directory
  if (fileName === "node_modules") return null;

  return (
    <div onClick={handleSelect}>
      <div className={`tree-node ${isSelected ? 'active' : ''}`}>
        {isDir ? (
          <FolderIcon isOpen={isOpen} />
        ) : (
          <FileIcon />
        )}
        <span>{fileName}</span>
      </div>
      
      {isDir && isOpen && (
        <div style={{ marginLeft: "16px" }}>
          {Object.keys(nodes).map((child) => (
            <FileTreeNode
              key={child}
              onSelect={onSelect}
              path={path + "/" + child}
              fileName={child}
              nodes={nodes[child]}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect, selectedFile }) => {
  return (
    <div>
      <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} selectedFile={selectedFile} />
    </div>
  );
};

export default FileTree;