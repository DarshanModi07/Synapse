import React from 'react';
import { Lightbulb } from 'lucide-react';

const TeamLeadPredictions = ({ predictions }) => {
    if (!predictions || predictions.length === 0) return null;

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-6 mt-6">
            <h3 className="text-white font-semibold text-sm mb-6 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" /> AI Predictions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions.map((pred, idx) => (
                    <div key={idx} className="bg-[#08070F] border border-[#2D2B45] rounded-xl p-4 flex gap-3">
                        <div className="mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{pred}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamLeadPredictions;
