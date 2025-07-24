import { Card } from "../ui/card";

interface Milestone {
    name: string;
    target: number;
    progress: number;
    reward: string;
    achieved: boolean;
}

export default function PerformanceMilestones({ milestones }: { milestones: Milestone[] }) {
    return (
        <Card className="p-6">
            <h3 className="font-semibold mb-4">Performance Milestones</h3>
            <div className="space-y-4">
                {milestones.map((milestone, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{milestone.name}</span>
                            <span className="text-sm text-gray-500">
                                {milestone.progress}/{milestone.target}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-epilux-blue h-2.5 rounded-full"
                                style={{
                                    width: `${Math.min(100, (milestone.progress / milestone.target) * 100)}%`,
                                }}
                            ></div>
                        </div>
                        <div className="mt-1 flex justify-between">
                            <span className="text-xs text-gray-500">Reward: {milestone.reward}</span>
                            {milestone.achieved ? (
                                <span className="text-xs text-green-600">Achieved</span>
                            ) : (
                                <span className="text-xs text-gray-500">In progress</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}