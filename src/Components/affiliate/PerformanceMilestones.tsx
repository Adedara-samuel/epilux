import React from 'react';
import { Card } from '@/Components/ui/card';
import { Award, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
interface Milestone {
    name: string;
    progress: number;
    target: number;
    reward: string;
    achieved: boolean;
}


export const PerformanceMilestones = ({ milestones }: { milestones: Milestone[] }) => {
    return (
        <Card className="p-6 h-full">
            <h3 className="flex items-center text-xl font-bold text-gray-800 mb-6 border-b pb-3">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Performance Milestones
            </h3>
            <div className="space-y-6">
                {milestones.map((milestone, index) => {
                    const percentage = Math.min(100, (milestone.progress / milestone.target) * 100);
                    const progressColor = milestone.achieved ? 'bg-green-500' : 'bg-blue-500';

                    return (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            {/* Milestone Title and Progress Text */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-base font-semibold text-gray-700">{milestone.name}</span>
                                <span className="text-sm font-bold text-gray-700">
                                    {milestone.progress.toLocaleString()}/{milestone.target.toLocaleString()}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>

                            {/* Reward and Status */}
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-600 font-medium flex items-center">
                                    Reward: <span className="ml-1 font-semibold text-orange-600">{milestone.reward}</span>
                                </span>
                                {milestone.achieved ? (
                                    <span className="flex items-center text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Achieved
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                        <Clock className="h-3.5 w-3.5 mr-1" /> In Progress
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
                <Link href="/affiliate/milestones" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    View All Milestones &rarr;
                </Link>
            </div>
        </Card>
    );
};
