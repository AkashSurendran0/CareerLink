'use client'

import { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import type { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap';
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from 'react-tooltip'

interface HeatmapValue {
    date: string;
    count?: number;
    color?: string;
}

interface HeatmapProps {
    heatMap: HeatmapValue[];
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

                classForValue={(val: ReactCalendarHeatmapValue<string> | undefined) => {
                    if (!val) return "color-empty"; // tailwind override below
                    return `custom-${(val as HeatmapValue).color?.replace("#", "") ?? "000"}`;
                }}

                tooltipDataAttrs={(value: ReactCalendarHeatmapValue<string> | undefined): TooltipDataAttrs => {
                    if (!value || !(value as HeatmapValue).date) {
                        return ({ "data-tooltip-id": "heatmap-tooltip", "data-tooltip-content": "" } as unknown) as TooltipDataAttrs;
                    }
                    const hv = value as HeatmapValue;
                    return ({
                        "data-tooltip-id": "heatmap-tooltip",
                        "data-tooltip-content": `${hv.date} has count: ${hv.count ?? 0}`,
                    } as unknown) as TooltipDataAttrs;
                }}
                showWeekdayLabels={true}
            />
            <Tooltip id="heatmap-tooltip" />
        </div>
    );
}
