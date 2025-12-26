'use client'

import { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from 'react-tooltip'

interface HeatmapProps {
    heatMap: any[];
}

export default function Heatmap({ heatMap }: HeatmapProps) {
    const year = new Date().getFullYear()

    return (
        <div className="w-full max-w-[900px] overflow-x-auto p-4 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution Heatmap (of current year)</h3>

            <CalendarHeatmap
                startDate={new Date(`${year}-01-01`)}
                endDate={new Date(`${year}-12-31`)}
                values={heatMap}

                classForValue={(val) => {
                    if (!val) return "color-empty"; // tailwind override below
                    return `custom-${val.color.replace("#", "")}`;
                }}

                tooltipDataAttrs={(value: any) => {
                    if (!value || !value.date) {
                        return { "data-tooltip-id": "heatmap-tooltip", "data-tooltip-content": "" }
                    }
                    return {
                        "data-tooltip-id": "heatmap-tooltip",
                        "data-tooltip-content": `${value.date} has count: ${value.count}`,
                    } as any
                }}
                showWeekdayLabels={true}
            />
            <Tooltip id="heatmap-tooltip" />
        </div>
    );
}
