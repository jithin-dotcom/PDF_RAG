

import FileUploadComponent from "./components/file-upload";

export default function Home() {
  return (
     <div>
      <div className="min-h-screen w-screen flex">
        <div className="min-h-screen w-[30vw] flex justify-center items-center">
           <FileUploadComponent/>
        </div>
        <div className="min-h-screen w-[70vw] border-l-2">2</div>
      </div>
     </div>
  );
}
