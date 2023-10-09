import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import printer from './assets/printer.svg'

import PDFRENDER from './components/PDF.jsx'

import generatePDF from 'react-to-pdf';

function App() {
  const [count, setCount] = useState(0)

  const targetRef = useRef();
  return (
    <>
      <div className="App">
        <button class="createPDF" onClick={() => generatePDF(targetRef, {filename: 'report.pdf'})}>
         <img src={printer} width="18" alt="" /> Print
        </button>
        <div className="pdfViewer">
          <div ref={targetRef} class="PDFData">
            <PDFRENDER />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
