import { useState, useEffect } from "react";
import { Mail, Send, Users, UserPlus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getStudentsForMail, dispatchMail } from "../../services/emailService";

export default function SendMail() {
  const [targetType, setTargetType] = useState("ALL"); // "ALL" or "SPECIFIC"
  const [students, setStudents] = useState([]);
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    getStudentsForMail()
      .then((data) => setStudents(data))
      .catch((err) => console.error("Failed to load students directory", err));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "Subject and Message are required." });
      return;
    }
    if (targetType === "SPECIFIC" && selectedStudentEmails.length === 0) {
      setFeedback({ type: "error", text: "Please select at least one specific student." });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const payload = {
        target: targetType === "ALL" ? "ALL" : selectedStudentEmails.join(","),
        subject,
        // Simple line breaks to BR tags for basic HTML formatting
        html: `<div style="font-family: sans-serif; color: #333;">${message.replace(/\n/g, "<br/>")}</div>`
      };

      const response = await dispatchMail(payload);
      setFeedback({ type: "success", text: response.message || "Email broadcast sent successfully!" });
      setSubject("");
      setMessage("");
      setSelectedStudentEmails([]);
    } catch (err) {
      setFeedback({ 
        type: "error", 
        text: err.response?.data?.message || err.message || "Failed to send email." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentEmails(students.map(s => s.email));
    } else {
      setSelectedStudentEmails([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
              <Mail className="text-indigo-600" size={32} />
              Broadcast Mail
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Send real-time emails to the student body using the external SMPT service.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          {feedback && (
            <div className={`px-6 py-4 flex items-center gap-3 border-b ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-semibold text-sm">{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleSend} className="p-8 space-y-8">
            
            {/* Target Selection */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Recipient Criteria</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTargetType("ALL")}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    targetType === "ALL" 
                    ? "border-indigo-600 bg-indigo-50 shadow-sm shadow-indigo-100" 
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${targetType === "ALL" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${targetType === "ALL" ? "text-indigo-900" : "text-slate-700"}`}>All Students</h3>
                    <p className={`text-xs mt-0.5 font-medium ${targetType === "ALL" ? "text-indigo-600/80" : "text-slate-400"}`}>Broadcast to every registered student</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType("SPECIFIC")}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    targetType === "SPECIFIC" 
                    ? "border-indigo-600 bg-indigo-50 shadow-sm shadow-indigo-100" 
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${targetType === "SPECIFIC" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${targetType === "SPECIFIC" ? "text-indigo-900" : "text-slate-700"}`}>Specific Students</h3>
                    <p className={`text-xs mt-0.5 font-medium ${targetType === "SPECIFIC" ? "text-indigo-600/80" : "text-slate-400"}`}>Select multiple specific targeted users</p>
                  </div>
                </button>
              </div>

              {targetType === "SPECIFIC" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 font-medium">
                    
                    {/* Select All Checkbox */}
                    {students.length > 0 && (
                      <div className="pb-3 border-b border-slate-200 mb-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedStudentEmails.length === students.length && students.length > 0}
                            onChange={handleSelectAll}
                            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="font-bold text-slate-700">Select All Students</span>
                        </label>
                      </div>
                    )}

                    {/* Scrollable Students List */}
                    <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-300 pr-2">
                       {students.map((student) => (
                        <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                          <input
                            type="checkbox"
                            value={student.email}
                            checked={selectedStudentEmails.includes(student.email)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentEmails(prev => [...prev, student.email]);
                              } else {
                                setSelectedStudentEmails(prev => prev.filter(email => email !== student.email));
                              }
                            }}
                            className="w-4 h-4 text-indigo-600 rounded flex-shrink-0 border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="text-sm truncate">
                             <span className="font-bold">{student.name}</span> <span className="text-slate-500 ml-1">({student.email})</span>
                             {student.branch && <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{student.branch}</span>}
                          </span>
                        </label>
                      ))}
                      {students.length === 0 && (
                        <div className="text-center text-sm text-slate-500 py-6 font-medium">No students found.</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 px-2">
                     <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                       {selectedStudentEmails.length} recipient(s) chosen
                     </span>
                  </div>
                </div>
              )}
            </div>

            {/* Subject Input */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Email Subject</label>
              <input
                type="text"
                placeholder="e.g., Important: Upcoming Drive Registration"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Message Content</label>
              <textarea
                rows={8}
                placeholder="Write your email body here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-y font-medium block"
              ></textarea>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex items-center justify-end border-t border-slate-100">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex flex-row items-center gap-2 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send External Mail
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
