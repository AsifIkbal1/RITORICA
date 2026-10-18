import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

export function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  if (!total) return <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No tickets yet</div>;
  return (
    <div className="flex h-full items-center gap-3">
      <div className="h-full flex-1">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data.filter((d) => d.value)} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="90%" paddingAngle={2} stroke="none">
              {data.filter((d) => d.value).map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-1 text-xs">
        {data.map((d) => (
          <li key={d.name} className={cn("flex items-center gap-1.5", !d.value && "opacity-50")}>
            <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="ml-auto pl-2 font-medium tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
