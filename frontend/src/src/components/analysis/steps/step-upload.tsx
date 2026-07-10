import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Image as ImageIcon, X } from "lucide-react";

export function StepUpload({ onAnalyze }: { onAnalyze: () => void }) {
  const [files, setFiles] = useState<{name: string, type: string}[]>([]);

  const handleSimulateUpload = () => {
    // In a real app, this would use an input type="file"
    setFiles(prev => [...prev, { name: `Blood_Report_${prev.length + 1}.pdf`, type: 'pdf' }]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload Medical Reports</h2>
        <p className="text-muted-foreground">
          Optional: Upload any recent lab results, X-rays, or prescriptions. Our AI extracts text using OCR to improve diagnosis accuracy.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div 
          onClick={handleSimulateUpload}
          className="border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-colors rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer mb-6"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Click or drag files to upload</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, JPG, PNG (Blood Reports, X-Ray, MRI, ECG, Prescriptions)
          </p>
          <Button variant="secondary" size="sm" className="pointer-events-none">
            Select Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Uploaded Files</h4>
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    {file.type === 'pdf' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">OCR Processing Ready</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 mt-auto flex justify-between items-center border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          {files.length === 0 ? "You can skip this step if you have no reports." : `${files.length} file(s) attached.`}
        </p>
        <Button size="lg" onClick={onAnalyze} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
          Start AI Analysis ✨
        </Button>
      </div>
    </div>
  );
}
