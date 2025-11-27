'use client'

import { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {Tooltip} from 'react-tooltip'

export default function Heatmap({ heatMap }) {
    const year=new Date().getFullYear()

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

                tooltipDataAttrs={(value) => {
                    if (!value?.date) return null;

                    return {
                        "data-tooltip-id": "heatmap-tip",
                        "data-tooltip-content": `${value.date} – ${value.count} contributions`,
                    };
                }}
                showWeekdayLabels={true}
            />
            <Tooltip id="heatmap-tip" />
        </div>
    );
}
