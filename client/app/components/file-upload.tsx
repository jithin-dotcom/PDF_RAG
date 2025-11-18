
"use client"

import * as React from "react";
import { Upload } from "lucide-react";


const FileUploadComponent: React.FC = () => {
    const handleFileUploadButtonClick = () => {
        const el = document.createElement('input');
        el.setAttribute("type", "file");
        el.setAttribute("accept", "application/pdf");
        el.addEventListener("change", ()=>{
            if(el.files && el.files.length > 0){
                const file = el.files.item(0);
            }
        })
        el.click();
    }
    return(
        <>
          <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-1">
            <div onClick={handleFileUploadButtonClick} className="flex justify-center items-center flex-col">
                <h3>upload your file</h3>
                <Upload />
            </div>
            
          </div>
        </>
    )
}

export default FileUploadComponent;