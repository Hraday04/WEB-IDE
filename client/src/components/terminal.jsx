import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import socket from "../socket";

import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef();
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

     // Create terminal
    const term = new XTerminal({
      rows: 20,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        cursorAccent: '#1e1e1e',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#1e1e1e',
        red: '#ce4e4e',
        green: '#6A9955',
        yellow: '#d7ba7d',
        blue: '#569cd6',
        magenta: '#c586c0',
        cyan: '#4ec9b0',
        white: '#d4d4d4',
        brightBlack: '#808080',
        brightRed: '#f44747',
        brightGreen: '#73c991',
        brightYellow: '#dcdcaa',
        brightBlue: '#9cdcfe',
        brightMagenta: '#d7bfdc',
        brightCyan: '#9cdcfe',
        brightWhite: '#ffffff'
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      scrollback: 1000,
    });

    term.open(terminalRef.current);

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    function onTerminalData(data) {
      term.write(data);
    }

    socket.on("terminal:data", onTerminalData);
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;