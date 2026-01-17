'use client'

import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import type { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap';
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from 'react-tooltip'

type HeatmapDayData = {
  date: string;
  count: number;
  color: string;
};

type HeatmapDay = {
  date: string;
  count: HeatmapDayData;
};

type HeatmapValue = HeatmapDay[];

interface HeatmapProps {
    heatMap: HeatmapValue;
}

export default function Heatmap({ heatMap }: HeatmapProps) {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    
    useEffect(() => {
        if(!heatMap.length) return
        const startArray=heatMap[0]
        const endArray=heatMap[heatMap.length-1]
        if (!startArray || !endArray) return
        setStartDate(startArray.count.date)
        setEndDate(endArray.count.date)
    }, [heatMap])

    const calendarValues = useMemo(
        () =>
        heatMap.flat().map(day => ({
            date: day.count.date,
            count: day.count.count,
            color: day.count.color,
        })),
        [heatMap]
    );
    
    return (
        <div className="w-full max-w-[900px] overflow-x-auto p-4 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution Heatmap (of current year)</h3>

            {startDate && endDate && (
                <CalendarHeatmap
                    startDate={new Date(startDate)}
                    endDate={new Date(endDate)}
                    values={calendarValues}

                    classForValue={(val: ReactCalendarHeatmapValue<string> | undefined) => {
                        if (!val) return "color-empty"; // tailwind override below
                        const v = val as { color?: string };
                        return v.color
                        ? `custom-${v.color.replace("#", "")}`
                        : "color-empty";
                    }}

                    tooltipDataAttrs={(value: ReactCalendarHeatmapValue<string> | undefined): TooltipDataAttrs => {
                        if (!value) {
                            return {
                                "data-tooltip-id": "heatmap-tooltip",
                                "data-tooltip-content": "",
                            } as Record<string, string>;
                        }
                        const v = value as { date: string; count?: number };
                        return {
                            "data-tooltip-id": "heatmap-tooltip",
                            "data-tooltip-content": `${v.date} — ${v.count ?? 0} contributions`,
                        } as Record<string, string>;
                    }}
                    showWeekdayLabels={true}
                />
            )}
            <Tooltip id="heatmap-tooltip" />
        </div>
    );
}
