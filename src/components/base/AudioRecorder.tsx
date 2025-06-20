import { FC, useEffect, useMemo, useRef, useState } from "react";

interface AudioRecorderProps {
    onRecordingComplete: (file: File) => void;
    onRecordingDelete: () => void;
    existingFile?: File | null;
}

const AudioRecorder: FC<AudioRecorderProps> = ({
    onRecordingComplete,
    onRecordingDelete,
    existingFile,
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordTimeLeft, setRecordTimeLeft] = useState<number | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const file = new File([blob], `recording-${Date.now()}.webm`, { type: "audio/webm" });
                onRecordingComplete(file);
                setIsRecording(false);
                setRecordTimeLeft(null);
                clearTimers();
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordTimeLeft(30);

            timeoutRef.current = setTimeout(stopRecording, 30000);
            intervalRef.current = setInterval(() => {
                setRecordTimeLeft((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } catch (err) {
            console.error("Mikrofon erişimi alınamadı:", err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        clearTimers();
    };

    const clearTimers = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current?.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            clearTimers();
        };
    }, []);

    const audioPreviewUrl = useMemo(() => {
        return existingFile ? URL.createObjectURL(existingFile) : null;
    }, [existingFile]);

    useEffect(() => {
        return () => {
            if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
        };
    }, [audioPreviewUrl]);

    return (
        <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
                {!isRecording ? (
                    <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-[6px] text-white bg-blue-900 rounded hover:bg-blue-800 transition"
                    >
                        🎙️ Start Recording
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={stopRecording}
                        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700 transition"
                    >
                        ⏹️ Stop ({recordTimeLeft}s)
                    </button>
                )}

                {existingFile && (
                    <button
                        type="button"
                        onClick={onRecordingDelete}
                        className="px-3 py-2 bg-gray-300 rounded text-sm hover:bg-gray-400 transition"
                    >
                        ❌ Delete Voice Recording
                    </button>
                )}
            </div>

            {isRecording && (
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-red-500 transition-all duration-1000"
                        style={{ width: `${(30 - (recordTimeLeft || 0)) * (100 / 30)}%` }}
                    />
                </div>
            )}

            {audioPreviewUrl && (
                <audio controls className="w-full mb-2">
                    <source src={audioPreviewUrl} type={existingFile?.type} />
                    Your browser does not support audio playback.
                </audio>
            )}
        </div>
    );
};

export default AudioRecorder;
