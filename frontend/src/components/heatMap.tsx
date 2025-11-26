import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function Heatmap({ heatMap }) {
    return (
        <div className="w-full max-w-[900px] overflow-x-auto p-4 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution Heatmap</h3>

            <CalendarHeatmap
                startDate={new Date("2025-01-01")}
                endDate={new Date("2025-12-31")}
                values={heatMap}

                classForValue={(val) => {
                    if (!val) return "color-empty"; // tailwind override below
                    return `custom-${val.color.replace("#", "")}`;
                }}

                tooltipDataAttrs={(value) => {
                  if (!value?.date) return null;
                  return {
                    "data-tip": `${value.date} – ${value.count} contributions`,
                  };
                }}
            />

        </div>
    );
}
